requirejs.config({
    baseUrl : 'js',
    paths : {
        views : 'views',
        models : 'models',
        collections : 'collections'
    }
});

Experimental = { 
    
};

requirejs([ 'router' ], function(Router) {
    Experimental.vent = new Backbone.Marionette.EventAggregator();
    Experimental.app = new Backbone.Marionette.Application();

    // Routes
    Experimental.app.addInitializer(function(options) {
        Experimental.router = new Router();
        Backbone.history.start();
        console.log('routes initialized');
    });

    var options = {};
    Experimental.app.start(options);
});
