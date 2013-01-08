define([ 'models/basemodel', 'models/pendingstate' ], function(BaseModel, PendingState) {
    var Cell = BaseModel.extend({

        /**
         * Constructor
         */
        initialize : function(defaults) {
            Cell.__super__.initialize.call(this);
            this.bindHelper();

            if (defaults) {
                this.set('x', defaults.x);
                this.set('y', defaults.y);
                this.set('val', defaults.val);
            }

            this.on('change:pending', this.updatePlayerScore);
        },

        updatePlayerScore : function(player) {
            console.log('updatePlayerScore');

            Experimental.vent.trigger('gamestate:updatescore', player, this);
        },

        isOpponentTile : function(player) {
            return this.get('forPlayer') !== player && this.get('forPlayer') !== undefined;
        },

        isOwnTile : function(player) {
            return this.get('forPlayer') === player;
        },

        isStolen : function() {
            return this.get('pending').get('forPlayer') != undefined && this.get('forPlayer') !== undefined
                && this.get('forPlayer') !== this.get('pending').get('forPlayer');
        },

        isGrayTile : function() {
            return this.get('forPlayer') === undefined;
        },

        defaults : function() {
            return {
                x : undefined,
                y : undefined,
                val : undefined,
                forPlayer : undefined, // [1,2]
                pending : new PendingState()
            };
        },

    });

    return Cell;
});
