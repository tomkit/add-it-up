define(['views/baseview'], function(BaseView) {
    var InfoView = BaseView.extend({
        
        el : $('#info-container'),
        
        initialize : function(model) {
            InfoView.__super__.initialize.call(this);
            this.bindHelper();
            
            this.model = model; // gamestate
            
            this.model.on('change', this.render);
        },
        
        render : function() {
            var remaining = this.model.get('movesRemaining');
            this.$el.find('#tiles-remaining').html(remaining);
            
            var stealsRemaining = this.model.get('stealsRemaining');
            this.$el.find('#steals-remaining').html(stealsRemaining);
        }
        
        
    });
    
    return InfoView;
});