require.config({
    "paths": {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        rta: './rta.min',
        config: './config',
        utils: './utils',
        text: '../bower_components/requirejs-text/text'
    },
    shim: {
    	bootstrap: {
            deps: ['jquery']
        },
        rta:{
        	deps: ['bootstrap']
        },
        app :{
        	deps: ['jquery','bootstrap','rta','config','utils']
        }
    }

});

require(['jquery','bootstrap','rta','config','utils','app'], function ($,bootstrap,rta,config,utils,app) {
    'use strict';
    // use app here
    //console.log(app);
    //console.log('Running jQuery %s', $().jquery);

});
