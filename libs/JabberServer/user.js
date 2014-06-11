'use strict';

var BuddyList = require( './buddylist' ),
    xmpp = require( 'node-xmpp' )

function User( jid, name ) {
    this.buddylist = new BuddyList;

    this.online = true;
    this.status = "Available"
    this.jid = new xmpp.JID( jid );
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

User.prototype.onRecieveMessage = function( client, message ) {
    console.log("On Recieve Message");
};

User.prototype.updateFriends = function( parent ) {
    console.log("Update Friends");

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
        var presence = new xmpp.Element( 'presence', { from:this.jid , to:to.jid } )
                               .c( "status" ).t( this.status );
        client.send( presence );
    }
};

// User.prototype.on

module.exports = User;
