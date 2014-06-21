'use strict';

var xmpp = require("node-xmpp-server"),
    User = require("./user"),
    EventEmitter = require( "events" ).EventEmitter,
    util = require( "util" ),
    Element = require( "node-xmpp-core" ).ltx.Element,
    JID = require( "node-xmpp-core" ).JID

var JABBER_INFO = "http://jabber.org/protocol/disco#info"
var JABBER_ITEMS = "http://jabber.org/protocol/disco#items"
var JABBER_ROSTER = "jabber:iq:roster"

function Server( opts ) {
    this.opts = {};
    if( opts ) this.opts = opts;
    this.base = xmpp.C2SServer;
    this.base( opts );

    this.userlist = {};
    var nonindexedlist = this.initUserList();

    for( var user in nonindexedlist ) {
        this.userlist[ nonindexedlist[user].getKey() ] = nonindexedlist[user];
        nonindexedlist[user].messageCallback = this.sendMessage.bind( this )
    }

    this.on( 'shutdown', function() {
        for( var user in this.userlist ) {
            this.userlist[ user ].sendShutdownToStream();
        }
    } );
    //this._addConnectionListener(); // For some reason if we add this it get's called twice
};

util.inherits( Server, xmpp.C2SServer );

Server.prototype._addConnectionListener = function() {
    var self = this;
    console.log("_addConnectionListener");
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

    client.on('register', function( opts, cb ) {
        var user = new User( opts.jid.toString(), opts.jid.toString() );
        jabberserver.addUser( user );

        this.emit( 'registration-success', user );
    });

    client.on('authenticate', function( opts, cb ) {
        if( jabberserver.userlist[ opts.jid.bare() ] != null ) {
            var auth_success = jabberserver.userlist[ opts.jid.bare() ].authenticate( opts );

            cb(!auth_success, opts);
        } else {
            console.log( "User " + opts.jid.bare() + " not found" );
            cb(true, opts);
        }
    });

    client.on('auth-success', function( jid ) {
        jabberserver.userlist[ jid.bare() ].stream = client;
        // jabberserver.userlist[ jid.bare() ].messageCallback = this.sendMessage
    });

    client.on( 'stanza', function( stanza ) {
        if( stanza.getChild('query') ) { // Info query
            this.emit( 'query', stanza );
        } else if( stanza.getName() == "presence" ) { // Presence
            this.emit( 'presence', stanza );
        } else if( stanza.getName() == "message" ) { // Message
            this.emit( 'message', stanza );
        } else if( stanza.getChild( 'ping' ) != null ) {
            this.emit( 'ping', stanza );
        } else {
            console.log("Stanza Not Identified " + stanza);
        }
    });

    client.on( 'query', function( query ) {
        var type = query.getChild('query').attrs.xmlns
        var result = new Element( 'iq', { type:       'result',
                                          from:       query.attrs.to,
                                          to:         query.attrs.from,
                                          id:         query.attrs.id } )
                             .c( "query", { xmlns: type } )

        this.emit( type, query, result )
        client.send( result )
    });

    client.on( JABBER_ITEMS, function( query, parent ) {
        parent.c( "account", { type: "registered" } );
    } );

    client.on( JABBER_INFO, function( query, parent ) {
        parent.c( "account", { type: "registered" } );
    } );

    client.on( JABBER_ROSTER, function( query, parent ) {
        var jid = new JID( query.attrs.from.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].updateFriends( parent )
        } else {
            console.log("No user to roster update");
        }
    } );

    client.on( 'presence', function( query ) {
        var jid = new JID( query.attrs.from.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].updatePresence( client );
        } else {
            console.log("No user to roster update");
        }
    } );

    client.on( 'message', function( query ) {
        var jid = new JID( query.attrs.to.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].sendMessageToStream( query );
        }
    });

    client.on( 'ping', function( query ) {
        var jid = new JID( query.attrs.from.toString() );

        if( jabberserver.userlist[ jid.bare() ] ) {
            jabberserver.userlist[ jid.bare() ].respondToPing( query );
        }
    } );
}

Server.prototype.sendMessage = function( to, from, message ) {
    if( this.userlist[ to.bare() ] && this.userlist[ from.bare() ] ) {
        this.userlist[ to.bare() ].sendMessageTo( this.userlist[ from.bare() ], message );
    }
}

Server.prototype.initUserList = function() {
    return {};
}

Server.prototype.addUser = function( user ) {
    this.userlist[ user.getKey() ] = user;
}

module.exports = Server;
