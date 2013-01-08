define(function() {
    var BaseModel = Backbone.Model.extend({

        /**
         * Constructor
         */
        initialize : function() {
            _.bindAll(this, 'bindHelper');
        },
        
        bindHelper : function(scope) {
            var that = this;
            scope = scope || Object.getPrototypeOf(this);
            _.each(scope, function(val, key) {
                if(_.isFunction(val) && key !== 'constructor' && key !== '__proto__' && key !== 'initialize') {
                    _.bindAll(that, key);
                }
            });
        },

    });

    return BaseModel;
});
