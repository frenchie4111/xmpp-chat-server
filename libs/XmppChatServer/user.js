'use strict';

var BuddyList = require( './buddylist' ),
    xmpp = require( 'node-xmpp-server' ),
    util = require('util'),
    Element = require( "node-xmpp-core" ).ltx.Element,
    JID = require( "node-xmpp-core" ).JID

function User( jid, name ) {
    this.buddylist = new BuddyList;

    this.online = true;
    this.status = "Available"
    this.jid = new JID( jid );
    this.name = name;
}

User.prototype.getKey = function() {
    return this.jid.bare();
}

User.prototype.addBuddy = function( buddy ) {
    this.buddylist.addBuddy( buddy )
}

User.prototype.authenticate = function( opts ) {
    return true;
}

User.prototype.onRecieveMessage = function( message ) {
};

User.prototype.sendMessageFrom = function( to, message ) {
    this.messageCallback( to, this.jid, message );
};

User.prototype.sendMessageTo = function( from, message ) {
    console.log("Test");
    var item = new Element( 'message', { to: to.jid.getUser() + "@" + to.jid.getDomain(), // Strip out resource
                                              from: from.jid.getUser() + "@" + from.jid.getDomain(),
                                              type: "chat",
                                              id: "JabberServer" } )
                      .c("body").t( message );
    console.log( "Stream" + item );
    this.stream.send( item );
};

User.prototype.sendElementToStream = function( element ) {
    if( this.stream != null ) {
        this.stream.send( item );
    }
};

User.prototype.sendMessageToStream = function( query ) {
    var item = query;

    if( query.getChild( "body" ) ) {
        var message = query.getChild( "body" ).getText();
        var from = new JID( query.attrs.from.toString() );

        item = new Element( 'message', { to: this.jid.getUser() + "@" + this.jid.getDomain(), // Strip out resource
                                              from: from.getUser() + "@" + from.getDomain(),
                                              type: "chat",
                                              id: "JabberServer" } )
                       .c("body").t( message );
    }
    this.onRecieveMessage( item );
    this.sendElementToStream( item );
};

User.prototype.sendShutdownToStream = function() {
    item = new Element( "stream:error" )
    .c("system-shutdown", { "xmlns": "urn:ietf:params:xml:ns:xmpp-streams" });
    this.sendElementToStream( item );
};

User.prototype.updateFriends = function( parent ) {
    this.buddylist.addBuddiesToXml( parent )
};

User.prototype.updatePresence = function( client ) {
    var self = this;
    this.buddylist.list.forEach( function( buddy ) {
        buddy.sendPresenceTo( client, self );
        self.sendPresenceTo( client, buddy );
    });
};

User.prototype.sendPresenceTo = function( client, to ) {
    if( this.online == true ) {
        var presence = new Element( 'presence', { from:this.jid , to:to.jid } )
                               .c( "status" ).t( this.status );
        client.send( presence );
    }
};

User.prototype.respondToPing = function( ping ) {
    var ping_response = new Element( "iq", { to: ping.attrs.from, id: ping.attrs.id, type: "result" } );
}

module.exports = User;
