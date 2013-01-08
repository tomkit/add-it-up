define([ 'views/cellview', 'views/baseview', 'models/gamestate' ], function(CellView, BaseView, GameState) {
    var GridView = BaseView.extend({

        el : $('#grid'),

        events : {
            'click .cell' : 'onCellClick'
        },

        initialize : function(model) {
            GridView.__super__.initialize.call(this);
            this.bindHelper();

            this.model = model; // gamestate

            this.views = {};

            this.loadBoard();

            Experimental.vent.bindTo(Experimental.vent, 'gridview:getPlayerTurn', this.getPlayerTurn);
            Experimental.vent.bindTo(Experimental.vent, 'gridview:getTurnNum', this.getTurnNum);
            Experimental.vent.bindTo(Experimental.vent, 'gridview:getGameState', this.getGameState);
            Experimental.vent.bindTo(Experimental.vent, 'gridview:render', this.render);

        },

        _cumulativeOffset : function(element) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);

            return {
                top : top,
                left : left
            };
        },

        onCellClick : function(event) {
            var that = this;
            var x = $(event.currentTarget).attr('data-col');
            var y = $(event.currentTarget).parent().attr('data-row');

            x = parseInt(x, 10);
            y = parseInt(y, 10);

            if (this.model.get('movesRemaining') > 0 || this.model.isActivated(x, y)) {
                var isActivated = this.model.update(x, y, {
                    forPlayer : this.model.get('playerTurn')
                });
            } else {
                // show an error
            }

            if (isActivated) {
                // tween
                var clickedCellModel = this.model.getCell(x, y);
                var clickedCellView = this.views[clickedCellModel.cid];
                var clonedCellEl = clickedCellView.$el.find('p').clone();
                var targetEl = $('.player-area[data-playernum="' + this.model.get('playerTurn') + '"]');
                var GREEN = '#336633';
                var RED = '#820303';
                var color;
                
                // insert into dom
                $('body').append(clonedCellEl);

                // animate
                var originOffset = this._cumulativeOffset(clickedCellView.$el[0]);
                var targetElOffset = this._cumulativeOffset(targetEl[0]);
                targetElOffset.left += 135;
                var diff = {
                    top : 1 * (originOffset.top - targetElOffset.top),
                    left : 1 * (originOffset.left - targetElOffset.left)
                };
                if(clickedCellModel.isOpponentTile(this.model.get('playerTurn'))) {
                    color = RED;
                    clonedCellEl.html(clonedCellEl.html());
                } else {
                    color = GREEN;
                    clonedCellEl.html(clonedCellEl.html());
                }
                clonedCellEl.css({
                    position : 'absolute',
                    'font-size' : 'x-large',
                    top : originOffset.top + 'px',
                    left : originOffset.left + 'px',
                    color : color
                }).animate({
                    left : '-=' + diff.left + 'px',
                    top : '-=' + diff.top + 'px',
                    'fontSize' : 'medium'
                }, 500, 'swing', function() {
                    // remove from dom
                    clonedCellEl.remove();
                    
                    // update visuals of scoreboard
                    that.model.get('player1').trigger('change');
                    that.model.get('player2').trigger('change');
                });

            } else {
                that.model.get('player1').trigger('change');
                that.model.get('player2').trigger('change');
            }

        },

        loadBoard : function() {
            var i;
            var j;
            var ROWS = 5;
            var COLS = 5;
            var cellView;
            var data;

            for (i = 1; i <= COLS; i++) {
                for (j = 1; j <= ROWS; j++) {
                    data = {
                        x : j,
                        y : i
                    };

                    // view
                    cellView = new CellView(data);
                    this.views[cellView.model.cid] = cellView;

                    // model
                    this.model.init(cellView.model);
                }
            }

            this.model.start();

            this.render();
        },

        addPendingMove : function() {

        },

        // /**
        // * When user presses 'reset'
        // */
        // onReset: function() {
        // this.model.reset();
        // },

        // /**
        // * When user presses 'submit'
        // */
        // onSubmit : function() {
        // this.model.save();
        // },

        render : function() {
            _.each(this.views, function(cellView) {
                cellView.render();
            }, this);
        }
    });

    return GridView;
});