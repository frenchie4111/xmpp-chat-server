'use strict';

var xmpp = require("node-xmpp"),
    User = require("./user"),
    EventEmitter = require( "events" ).EventEmitter,
    util = require( "util" )

var JABBER_INFO = "http://jabber.org/protocol/disco#info"
var JABBER_ITEMS = "http://jabber.org/protocol/disco#items"
var JABBER_ROSTER = "jabber:iq:roster"

function Server( opts ) {
    console.log("Server");
    this.opts = {};
    if( opts ) this.opts = opts;
    this.base = xmpp.C2SServer;
    this.base( opts );

    this.userlist = {};
    //this._addConnectionListener(); // For some reason if we add this it get's called twice
};

Server.prototype = new xmpp.C2SServer;

Server.prototype._addConnectionListener = function() {
    var self = this;

    this.on( 'connect', function( client ) {
        console.log("connect")
        self.clientConnected( client )
    });
}

Server.prototype.clientConnected = function( client ) {
    var jabberserver = this

    client.on('authenticate', function( opts, cb ) {
        // jabberserver.userlist[opts.jid] = new User( opts.jid, opts.jid );
        // console.log("Adding user " + jabberserver.userlist);
        console.log( "Authenticate" );

        cb(false, opts); // Always authenticate successfully
    });

    client.on( 'stanza', function( stanza ) {
        console.log("stanza");
        if( stanza.getChild('query') ) {
            this.emit( 'query', stanza );
        } else if( stanza.getName() == "presence" ) {
            this.emit( 'presence', stanza );
        } else {
            console.log("Stanza Not Identified " + stanza);
        }
    });

    client.on( 'query', function( query ) {
        var type = query.getChild('query').attrs.xmlns
        var result = new xmpp.Element( 'iq', { type:       'result',
                                          from:       query.attrs.to,
                                          to:         query.attrs.from,
                                          id:         query.attrs.id } )
                        .c( "query", { xmlns: type } )

        this.emit( type, query, result )
        client.send( result )
    });

    client.on( JABBER_INFO, function( query, parent ) {
        parent.c( "account", { type: "registered" } );
    } );

    client.on( JABBER_ITEMS, function( query, parent ) {
        // noop
    } );

    client.on( JABBER_ROSTER, function( query, parent ) {
        // jabberserver.buddylist.sendRoster( parent )
        console.log("rost query " + query)
        jabberserver.userlist[ query.attr.from ].updateFriends( parent, jabberserver.userlist )
    } );

    client.on( 'presence', function( query ) {
        console.log("presence")
        // jabberserver.buddylist.sendStatus( client, "test@localhost" )
    } );
}

module.exports = Server;
