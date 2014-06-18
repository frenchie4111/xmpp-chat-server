'use strict';


module.exports = {
    User: require( "./libs/XmppChatServer/user" ),
    BuddyList: require( "./libs/XmppChatServer/buddylist" ),
    Server: require( "./libs/XmppChatServer/server" ),
    JID: require( "node-xmpp-core" ).JID
}
