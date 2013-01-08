define(['views/boardview'], function(BoardView) {
    var Router = Backbone.Router.extend({
        routes : {
//            '' : 'loadMain',
            '*actions' : 'loadApp',
//            '/' : 'loadMain',
//            'rtinstant' : 'loadRTInstant',
//            'rtinstant/' : 'loadRTInstant',
//            'rtinstant/*actions' : 'loadRTInstant',
//            '/*actions' : 'loadMain'
        },
        
        initialize : function() {
            console.log('initialize');
            _.bindAll(this, 'loadApp');
        },
        
        loadApp: function() {            
            this.boardView = new BoardView();
            console.log('loadApp');
        }
    });
    
    return Router;
});