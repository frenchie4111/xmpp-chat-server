"use strict";

var BuddyList = require( './buddylist' )

function User() {
    this.buddylist = new BuddyList;
}

User.prototype.onRecieveMessage = function( client, message ) {
    console.log("On Recieve Message");
};

// User.prototype.on

module.exports = User;
