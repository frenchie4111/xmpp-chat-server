'use strict';

var BuddyList = require( './buddylist' )

function User( jid, name ) {
    this.buddylist = new BuddyList;

    this.jid = jid;
    this.name = name;
}

User.prototype.onRecieveMessage = function( client, message ) {
    console.log("On Recieve Message");
};

User.prototype.updateFriends = function( parent, onlinelist ) {
    console.log("Update Friends");
};

// User.prototype.on

module.exports = User;
