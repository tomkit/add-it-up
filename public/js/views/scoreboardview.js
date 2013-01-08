define(['views/baseview'], function(BaseView) {
    var ScoreboardView = BaseView.extend({
        
        el : $('#scoreboard'),
        
        initialize : function(model) {
            ScoreboardView.__super__.initialize.call(this);
            this.bindHelper();
            
            this.model = model; // gamestate
            
            this.model.get('player1').on('change', this.render);
            this.model.get('player2').on('change', this.render);
        },
        
        start : function() {
            this.renderPlayerTurn();
        },
        
        render : function() {
            this.$el.find('#player1-score').html(this.model.get('player1').get('score'));
            this.$el.find('#player2-score').html(this.model.get('player2').get('score'));
            
            this.renderPlayerTurn();
        },
        
        renderPlayerTurn : function() {
            var color;            
            var playerTurnNum = this.model.get('playerTurn');
            if(playerTurnNum === 1) {
                color = '#6e87cc';
            } else {
                color = '#f49956';
            }
            this.$el.find('.player-area').css('background-color', 'white');
            this.$el.find('[data-playernum="'+playerTurnNum+'"]').css('background-color', color);
        }
        
        
    });
    
    return ScoreboardView;
});