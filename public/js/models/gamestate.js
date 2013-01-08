define([ 'collections/cells', 'models/basemodel', 'models/player' ], function(Cells, BaseModel, Player) {
    var GameState = BaseModel.extend({

        /**
         * Constructor
         */
        initialize : function(defaults) {
            GameState.__super__.initialize.call(this);
            this.bindHelper();

            this.set('player1', new Player({
                num : 1,
                color : 'blue'
            }));
            this.set('player2', new Player({
                num : 2,
                color : 'red'
            }));
            this.set('boardState', new Cells());

            Experimental.vent.bindTo(Experimental.vent, 'gamestate:updatescore', this.updateScore);
        },

        updateScore : function(playerNum, cell) {
            var val;
            var opponentVal;
            var player = this.get('player' + playerNum);
            var opponentNum = (playerNum % 2) + 1;
            var opponent = this.get('player' + opponentNum);
            var shouldPenalize = false;
            
            // activated
            if (cell.get('pending').get('activated')) {
                
                // own tile
                if (cell.isGrayTile() || cell.isOwnTile(this.get('playerTurn'))) {
                    val = cell.get('val');

                } else { // opponents tile
                    val = -1 * cell.get('val');
                    opponentVal = cell.get('val');
                    shouldPenalize = true;
                }
            } else { // deactivated
                
                // own tile
                if (cell.isGrayTile() || cell.isOwnTile(this.get('playerTurn'))) {
                    val = -1 * cell.get('val');
                } else { // opponents tile
                    val = cell.get('val');
                    opponentVal = -1 * cell.get('val');
                    shouldPenalize = true;
                }

            }

            // yours
            var newScore = player.get('score');
            newScore += val;
            player.set({
                score : newScore
            }, {
                silent: true
            });

            // opponents
            if (shouldPenalize) {
//                var opponentNewScore = opponent.get('score');
//                opponentNewScore += opponentVal;
//                opponent.set({
//                    score : opponentNewScore
//                }, {
//                    silent: true
//                });
            }
        },

        defaults : function() {
            return {
                player1 : undefined,
                player2 : undefined,
                boardState : undefined,
                playerTurn : 1,
                round : 0,
                movesRemaining : 3,
                stealsRemaining : 1
            };

        },

        init : function(data) {
            this.get('boardState').add(data);
        },

        start : function() {
            this.pendingBoardState = this.get('boardState');
        },

        getCell : function(x, y) {
            var cell = this.pendingBoardState.where({
                x : x,
                y : y
            });

            if (cell.length !== 1) {
                throw new Error('invalid game state: too many cells returned.');
            }

            return cell[0];
        },

        isActivated : function(x, y) {
            var cell = this.getCell(x, y);
            var pending = cell.get('pending');

            return pending.get('activated');
        },

        update : function(x, y, data) {
            var cell = this.getCell(x, y);
            var pending = cell.get('pending');
            var remaining = this.get('movesRemaining');
            var isActivated = false;

            
            
            pending.set('activated', !pending.get('activated'));

            // just activated
            if (pending.get('activated')) {
                remaining--;
                pending.set('forPlayer', data.forPlayer);
                isActivated = true;
                
                if(cell.isOwnTile(data.forPlayer)) {
                    pending.set('forPlayer', undefined);
                    pending.set('activated', !pending.get('activated'));
                    return;
                } else if(cell.isStolen() && this.get('stealsRemaining') === 1) {
                    this.set('stealsRemaining', 0);
                } else if(cell.isStolen()){
                    pending.set('forPlayer', undefined);
                    pending.set('activated', !pending.get('activated'));
                    return;
                }

                // NOTE: i think only changing the nested object (new Obj())
                // will cause a 'change' event to be fired.
                 cell.trigger('change:pending', this.get('playerTurn')); // NOTE: delay this until animation is done.
            } else { // just deactivated
                remaining++;
                
                if(cell.isStolen()) {
                    this.set('stealsRemaining', 1);
                }
                
                pending.set('forPlayer', undefined);

                // NOTE: i think only changing the nested object (new Obj())
                // will cause a 'change' event to be fired.
                cell.trigger('change:pending', this.get('playerTurn'));
            }

            this.set('movesRemaining', remaining);
            cell.set('pending', pending);

            return isActivated;
        },

        resetTurn : function() {
            var that = this;
            this.start();

            var modified = this.pendingBoardState.wherePending({
                activated : true
            });

            var total = 0;
            var opponentTotal = 0;
            _.each(modified, function(cell) {
                var pending = cell.get('pending');
                if (pending.get('activated') === true) {
                    if (cell.isGrayTile() || cell.isOwnTile(this.get('playerTurn'))) {
                        total += cell.get('val');
                    } else {
                        total -= cell.get('val');
                        opponentTotal += cell.get('val');
                    }

                    pending.set({
                        activated : false,
                        forPlayer : undefined
                    });
                }
            });

            // reset score
            var player = this.get('player' + this.get('playerTurn'));
            var opponent = this.get('player' + ((this.get('playerTurn') % 2) + 1));
            
            // own old score
            var oldScore = player.get('score');
            oldScore -= total;
            player.set('score', oldScore);
            
            // opponent old score
            var opponentOldScore = opponent.get('score');
            opponentOldScore -= opponentTotal;
            opponent.set('score', opponentOldScore);
            
            player.trigger('change');
            this.set('movesRemaining', 3);
            this.set('stealsRemaining', 1);

            Experimental.vent.trigger('gridview:render');
        },

        saveBoard : function() {
            //
            // move conditions
            //
            if (this.get('movesRemaining') !== 0) {
                // TODO: show message
                return;
            }

            this.set('boardState', this.pendingBoardState);

            _.each(this.pendingBoardState.models, function(cell) {
                var pending = cell.get('pending');
                if (pending.get('activated')) {
                    var forPlayer = pending.get('forPlayer');

                    // reset
                    pending.set({
                        activated : false,
                        forPlayer : undefined
                    });

                    // write pending
                    cell.set({
                        forPlayer : forPlayer,
                        pending : pending
                    });
                }

            });

            var playerTurn = this.get('playerTurn');
            playerTurn = (playerTurn % 2) + 1;
            this.set('playerTurn', playerTurn);
            this.set('movesRemaining', 3);
            this.set('stealsRemaining', 1);

            //
            // end game conditions
            //
            if (this.isGameOver()) {
                alert('game over!');
            }
        },

        isGameOver : function() {
            var isOver = true;
            var i;
            var cell;

            for (i = 0; i < this.pendingBoardState.models.length; i++) {
                cell = this.pendingBoardState.models[i];

                if (cell.get('forPlayer') === undefined) {
                    isOver = false;
                    break;
                }
            }

            return isOver;

        }

    });

    return GameState;
});
