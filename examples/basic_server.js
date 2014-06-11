"use strict";

var JabberServer = require( "../index" )

var server = new JabberServer.Server( { domain: "localhost", port: 5223, tls: false } );
