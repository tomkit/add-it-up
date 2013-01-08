define([ 'views/baseview', 'models/cell' ], function(BaseView, Cell) {
    var CellView = BaseView.extend({

        events : {
            'click' : 'onClick'
        },

        initialize : function(defaults) {
            CellView.__super__.initialize.call(this);
            this.bindHelper();

            var x; // row
            var y; // col

            y = defaults.y;
            x = defaults.x;

            var val = Math.floor(Math.random() * 3 + 1);
            var seed = Math.floor(Math.random()*10 + 1);
            if(seed <= 2) {
                val *= -1;
            };
            
            this.model = new Cell({
                x : x,
                y : y,
                val : val,
                forPlayer : undefined
            });

            this.setElement($('[data-row="' + y + '"] [data-col="' + x + '"]'));

            this.model.on('change:pending', this.render);
        },

        onClick : function(event) {
            // this.$el.css('background-color', 'red');
            // $.when(Experimental.vent.trigger('boardview:getPlayerTurn')).then(function(one, turn) {
            // console.log(one);
            // console.log(turn);
            // });
            // console.log('success');
        },

        animate : function() {
            var that = this;
            this.$el.css("-webkit-animation-name", "flip").css("-webkit-animation-duration", '1s').css('-webkit-animation-direction', 'alternate')
                .css('-webkit-animation-timing-function', 'ease-in-out');
            setTimeout(function() {
                that.$el.css('-webkit-animation-name', '').css('-webkit-animation-duration', '').css('-webkit-animation-direction', '').css(
                    '-webkit-animation-timing-function', '');
            }, 1000);
        },

        render : function() {
            var BLUE = '#6e87cc';
            var DARK_BLUE = '#015391';
            var RED = '#f49956';
            var DARK_RED = '#820303';
            var that = this;
            
            this.$el.find('p').html(this.model.get('val'));
            console.log(this.model.get('forPlayer'));
            if (this.model.get('pending').get('forPlayer') === 1) {

                if (this.model.get('pending').get('activated')) {
                    
                    if (this.model.get('forPlayer') === 1) {
                        this.$el.animate({
                            'backgroundColor' : DARK_BLUE
                        }, 200, function() {
                            that.$el.animate({
                                'backgroundColor' : BLUE
                            }, 200, function() {
                                
                            });
                        });
                        
                    } else if (this.model.get('forPlayer') === 2) {
                        this.$el.css('background-color', BLUE);
                        this.animate();
                    } else {
                        this.$el.css('background-color', BLUE);
                    }
                } else {
                    if (this.model.get('forPlayer') === 1) {
                        this.$el.css('background-color', BLUE);
                    } else if (this.model.get('forPlayer') === 2) {
                        this.$el.css('background-color', RED);
                    } else {
                        this.$el.css('background-color', 'gray');
                    }
                }
            } else if (this.model.get('pending').get('forPlayer') === 2) {
                if (this.model.get('pending').get('activated')) {
                    
                    
                    if (this.model.get('forPlayer') === 1) {
                        this.$el.css('background-color', RED);
                        this.animate();
                    } else if(this.model.get('forPlayer') === 2) {
                        this.$el.animate({
                            'backgroundColor' : DARK_RED
                        }, 200, function() {
                            that.$el.animate({
                                'backgroundColor' : RED
                            }, 200, function() {
                                
                            });
                        });
                    } else {
                        this.$el.css('background-color', RED);
                    }
                } else {
                    if (this.model.get('forPlayer') === 1) {
                        this.$el.css('background-color', BLUE);
                        this.animate();
                    } else if (this.model.get('forPlayer') === 2) {
                        this.$el.css('background-color', RED);
                    } else {
                        this.$el.css('background-color', 'gray');
                    }
                }
            } else if (this.model.get('forPlayer') === 1) {
                this.$el.css('background-color', BLUE);
            } else if (this.model.get('forPlayer') === 2) {
                this.$el.css('background-color', RED);
            } else {
                this.$el.css('background-color', 'gray');
            }
        }
    });

    return CellView;
});