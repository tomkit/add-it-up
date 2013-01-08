define(['models/basemodel'], function(BaseModel) {
    var Player = BaseModel.extend({

        /**
         * Constructor
         */
        initialize : function(defaults) {
            Player.__super__.initialize.call(this);
            this.bindHelper();
            
            if (defaults) {
                this.set('num', defaults.num);
                this.set('color', defaults.color);
            }
        },

        defaults : function() {
            return {
                num : undefined,
                score : 0,
                color : undefined
                
            };
        }

    });

    return Player;
});
