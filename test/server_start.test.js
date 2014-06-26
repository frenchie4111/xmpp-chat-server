var assert = require( 'assert' ),
    ip = require('ip'),
    xmpp_chat = require( '../index' );

describe( 'Server', function() {
    it( 'should start on localhost', function( done ) {
        var server = new xmpp_chat.Server(
            {
                domain: "localhost",
                port: 5223
            }, function() {
                assert.equal( 1, 1 );
                server.on( 'shutdown', function() {
                    assert.equal( 1, 1 );
                    done();
                } );
                server.shutdown();
            } );
    } );

    it( 'should start on 127.0.0.1', function( done ) {
        var server = new xmpp_chat.Server(
            {
                domain: "127.0.0.1",
                port: 5223
            }, function() {
                assert.equal( 1, 1 );
                server.on( 'shutdown', function() {
                    assert.equal( 1, 1 );
                    done();
                } );
                server.shutdown();
            } );
    } );

    it( 'should start on my ip', function( done ) {
        var server = new xmpp_chat.Server(
            {
                domain: ip.address(),
                port: 5223
            }, function() {
                assert.equal( 1, 1 );
                server.on( 'shutdown', function() {
                    assert.equal( 1, 1 );
                    done();
                } );
                server.shutdown();
            } );
    } );
} );
