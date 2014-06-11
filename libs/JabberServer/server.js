'use strict';

var xmpp = require("node-xmpp"),
    User = require("./user"),
    EventEmitter = require( "events" ).EventEmitter,
    util = require( "util" )

var JABBER_INFO = "http://jabber.org/protocol/disco#info"
var JABBER_ITEMS = "http://jabber.org/protocol/disco#items"
var JABBER_ROSTER = "jabber:iq:roster"

function Server( opts ) {
    this.opts = {};
    if( opts ) this.opts = opts;
    this.base = xmpp.C2SServer;
    this.base( opts );

    this.userlist = {};
    var nonindexedlist = this.getUserList();

    for( var user in nonindexedlist ) {
        this.userlist[ nonindexedlist[user].getKey() ] = nonindexedlist[user];
    }
    //this._addConnectionListener(); // For some reason if we add this it get's called twice
};

Server.prototype = new xmpp.C2SServer;

Server.prototype._addConnectionListener = function() {
    var self = this;

    this.on( 'connect', function( client ) {
        console.log("connect")
        self._clientConnected( client )
    });
}

Server.prototype._getOnlineUsers = function() {
    var onlineusers = []
    for( var user in this.userlist ) {
        if( user.online ) {
            onlineusers.push( user );
        }
    }
}

Server.prototype._clientConnected = function( client ) {
    var jabberserver = this
    this.client = client;

    client.on('authenticate', function( opts, cb ) {
        if( jabberserver.userlist[ opts.jid.bare() ] != null ) {
            console.log( "opts.jid.bare " + opts.jid.bare() );
            var auth_success = jabberserver.userlist[ opts.jid.bare() ].authenticate( opts );
            console.log( "Auth success: " + auth_success );

            cb(!auth_success, opts);
        } else {
            cb(true, opts); // Always authenticate successfully
        }
    });

    client.on( 'stanza', function( stanza ) {
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

    client.on( JABBER_ROSTER, function( query, parent ) {
        var jid = new xmpp.JID( query.attrs.from.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].updateFriends( parent )
        } else {
            console.log("No user to roster update");
        }
    } );

    client.on( 'presence', function( query ) {
        var jid = new xmpp.JID( query.attrs.from.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].updatePresence( client );
        } else {
            console.log("No user to roster update");
        }
    } );
}

Server.prototype.getUserList = function() {
    return {};
}

module.exports = Server;
