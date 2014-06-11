'use strict';

var BuddyList = require( './buddylist' ),
    xmpp = require( 'node-xmpp' )

function User( jid, name ) {
    this.buddylist = new BuddyList;

    this.online = true;
    this.jid = new xmpp.JID( jid );
    this.name = name;
}

User.prototype.getKey = function() {
    return this.jid.bare();
}

User.prototype.authenticate = function( opts ) {
    return true;
}

User.prototype.onRecieveMessage = function( client, message ) {
    console.log("On Recieve Message");
};

User.prototype.updateFriends = function( parent, onlinelist ) {
    console.log("Update Friends");

    for( var friend in onlinelist ) {
        console.log( "updateFriend " + friend );
    }
};

// User.prototype.on

module.exports = User;
