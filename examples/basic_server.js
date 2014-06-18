"use strict";

var JabberServer = require( "../index" )

JabberServer.Server.prototype.initUserList = function() {
    var list = [];

    var echo_friend = new JabberServer.User( "echo@localhost", "Echo 1" );

    echo_friend.onRecieveMessage = function( message ) {
        if( message.getChild("body") ) {
            echo_friend.sendMessageFrom( new JabberServer.JID( message.attrs.from ), message.getChild("body").getText() );
        }
    }

    var friend2 = new JabberServer.User( "friend1@localhost", "Friend 1" );

    var localhost = new JabberServer.User( "main@clever", "Test Localhost" );
    localhost.addBuddy( echo_friend );
    localhost.addBuddy( friend2 );

    friend2.addBuddy( localhost );

    list.push( localhost );
    list.push( echo_friend );
    list.push( friend2 );
    return list;
}

var server = new JabberServer.Server( { domain: "10.0.0.16", port: 5223, tls: false } );
