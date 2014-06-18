'use strict';


module.exports = {
    User: require( "./libs/JabberServer/user" ),
    BuddyList: require( "./libs/JabberServer/buddylist" ),
    Server: require( "./libs/JabberServer/server" ),
    JID: require( "node-xmpp-core" ).JID
}
