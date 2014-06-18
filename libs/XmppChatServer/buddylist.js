'use strict';

function BuddyList() {
    this.list = []
}

BuddyList.prototype.addBuddy = function( buddy ) {
    this.list.push( buddy )
}

BuddyList.prototype.addBuddiesToXml = function( parent ) {
    this.list.forEach( function( entry ) {
        parent.c('item',{ jid:        entry.jid,
                          approved:   'true',
                          name:       entry.name,
                          subscription: 'both' } );
    } );
}

module.exports = BuddyList;
