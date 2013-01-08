define(['models/basemodel'],function(BaseModel) {
    var PendingState = BaseModel.extend({

        /**
         * Constructor
         */
        initialize : function() {
            PendingState.__super__.initialize.call(this);
            this.bindHelper();
            
            
        },
        
        activatedEquals : function(obj) {
            if(obj.activated === this.get('activated')) {
                return true;
            }
            
            return false;
        },
        
        defaults : function() {
            return {
                forPlayer : undefined,
                activated : false
                
            };
        }

    });

    return PendingState;
});
