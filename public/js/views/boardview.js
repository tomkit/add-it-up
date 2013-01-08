define([ 'views/gridview', 'models/gamestate', 'models/player', 'views/baseview', 'views/scoreboardview', 'views/infoview' ], function(GridView,
    GameState, Player, BaseView, ScoreboardView, InfoView) {
    var BoardView = BaseView.extend({

        el : $('#body'),

        events : {
            'click #clear' : 'onClear',
            'click #submit' : 'onSubmit'
        },

        initialize : function() {
            BoardView.__super__.initialize.call(this);
            this.bindHelper();

            this.model = new GameState();
            this.scoreboardView = new ScoreboardView(this.model);
            this.infoView = new InfoView(this.model);
            this.scoreboardView.start();
            this.gridView = new GridView(this.model);

        },

        /**
         * Return whose turn it is
         * 
         * @returns
         */
        getPlayerTurn : function(cb) {
            var deferred = new $.Deferred();
            console.log('here');
            deferred.resolve(this.gameState.playerTurn);

            return deferred.promise();
        },

        /**
         * Return current number of turns
         * 
         * @returns
         */
        getTurnNum : function(cb) {
            var deferred = new $.Deferred();

            deferred.resolve(this.gameState.turnNum);

            return deferred.promise();
        },

        /**
         * Return whole game state
         * 
         * @returns {___anonymous347_421}
         */
        getGameState : function(cb) {
            var deferred = new $.Deferred();

            deferred.resolve(this.gameState);

            return deferred.promise();
        },

        onClear : function(event) {
            this.gridView.model.resetTurn();
        },

        onSubmit : function(event) {
            this.gridView.model.saveBoard();
            this.scoreboardView.render();
        }
    });

    return BoardView;
});