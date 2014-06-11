'use strict';

function BuddyList() {
    this.list = []
}

BuddyList.prototype.addBuddy = function( buddy ) {
    this.list.push( buddy )
}

module.exports = BuddyList;
