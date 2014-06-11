"use strict";

var JabberServer = require( "../index" )

JabberServer.Server.prototype.getUserList = function() {
    var list = [];

    var friend1 = new JabberServer.User( "friend1@localhost", "Friend 1" );
    var friend2 = new JabberServer.User( "friend2@localhost", "Friend 2" );

    var localhost = new JabberServer.User( "test@localhost", "Test Localhost" );
    localhost.addBuddy( friend1 );
    localhost.addBuddy( friend2 );

    list.push( localhost );
    list.push( friend1 );
    list.push( friend2 );
    return list;
}

var server = new JabberServer.Server( { domain: "localhost", port: 5223, tls: false } );
