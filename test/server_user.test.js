var xmpp_chat = require( '../index' ),
    xmpp = require( 'node-xmpp' );

describe( 'User registration and signon', function() {
    var server;
    before( function( done ) {
        server = new xmpp_chat.Server(
             {
                 domain: "localhost",
                 port: 5223
             }, function() {
                 done();
             } );
    } );

    it( 'Should register user', function( done ) {
        var client = new xmpp.Client( {
            jid: "test@localhost",
            password: "test",
            port: 5223
        } );

        client.on( 'auth', function() {
            assert.equals( client.state = 1 );
            done();
        } );
    } );

    after( function( done ) {
        server.on( 'shutdown', function() {
            done();
        } );
        server.shutdown();
    } )
} );
