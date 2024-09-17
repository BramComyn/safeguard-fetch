# Safeguard-Fetch: a wrapper around Node.js's ``http2``-module

This document is meant as a complete documentation guide for the architecture
of my three-week project for IDLab.
I will be explaining why certain decisions have been made,
to ensure that no doubt remains in further work on this repository.
Should you still have any questions,
then I will always remain open to explain myself further.

## Goal

The goal of this repository is to provide developers of automatic querying
engines for linked data with a safer way of interacting with the ``http2``-
module of Node.js.
It was necessary to provide certain hooks to this library,
so that developers could write handler-functions for certain events/
event combinations.

## Wrapper

This repository provides such feature through its ``SafeguardRequester``-class.
This class is a wrapper around the ``connect``- and ``request``-functions
of Node.js's ``http2``-module.
The wrapper allows the user to define some handlers that can be registered and
will then automatically be added as listener on every new client session
(new connection to a server) or new request stream (one duplex stream to the connected server).

The idea behind this, is that adding the handler to this wrapper class provides
a smoother and more dynamic experience in requesting resources with certain
constraints.
The configuration and combination of event handlers can differ per
instance of the wrapper class, making it possible to rapidly reuse different constraints
for different connections or even requests within those connections.

Behind the scenes, the wrapper will add event handlers as listeners to the requests and
clients, just as one would do when manually adding these straight to the
client or request.
The clue is that those are abstracted away and that the
user-written handlers have different signatures for the event as the handler
functions one would manually attach.

It is imperative to notice that this class is not an ``EventEmitter``, although
it resembles one. In the next sections, we will give more context as to why this
design decision was made.

It would be useless to define any custom typed event emitters, as they can serve no purpose in the
architectural style I decided to implement. The types of the event handlers are
defined, but wrapping the client sessions or request streams would implicitly
mean a lot of hassle trying to do something in the ``http2``-module, without
doing so.

### Event handlers and their typings

Each event handler handles a certain event defined by the ``Http2Event``-,
``ClientHttp2Event``- and ``RequestHttp2Event``-types. The handlers themselves
are always functions, for which the first parameter is the instance that emits
the event on which is being acted. Here lies the difference when writing a
handler for the wrapper and writing a handler that is directly attached to the
client or request. Attaching a handler directly to this emitter requires
reference to that emitter.

```ts
request.on('response', (headers: IncomingHttpHeaders, flags: number): void => {
  if (headers[':status'] === '404') {
    // the reference to the request is not passed as an argument!
    request.close();
  }
});
```

To support this for multiple requests, the request which should be closed, has
to be passed as a parameter, like this:

```ts
/**
  * Or any self-defined function that adheres to the type as defined by the 
  * aforementioned types
  */
function closeOn404(
  request: ClientHttp2Stream,
  IncomingHttp2Headers,
  flags: number,
 ): void {
  if (headers[':status'] === '404') {
    request.close();
  }
 }

request.on('response', (headers: IncomingHttpHeaders, flags: number): void => {
  closeOn404(request, headers, flags);
});
```

This architecture makes it so that it is unnecessary to write any self-defined
event emitters, but allows the user to write event handlers that can be set on
multiple client sessions or request streams.

```ts
function closeOn404(
  request: ClientHttp2Stream,
  headers: IncomingHttp2Headers,
  flags: number,
): void {
  if (headers[':status'] === '404') {
    request.close();
  }
}

const requester: SafeguardRequester = new SafeguardRequester();
requester.addRequestEventHandler('response', closeOn404);

// Now, when requests will be made, the listener will automatically be
// set on the created requests

const request: ClientHttp2Stream = requester.connectAndRequest({
  authority: 'https://example.com',
  sessionOptions: undefined,
  listener: undefined,
  requestHeaders: {
    ':path': '/non-existing-path', // Would trigger 404
  },
  requestOptions: undefined,
});
```

If we had decided to make the ``requester`` an ``EventEmitter`` instance,
we would have to wrap the ``client`` or ``request`` in a new class, but then
you would already have the instance and you could use the normal way of
directly attaching the handler, which brings us back to why I wrote this whole
wrapper.

In short: the handlers you have to write for the wrapper have the exact same
declaration and type signature, except for the addition of an extra argument,
being the client session or request stream.

### Earlier decisions concerning the wrapper's implementation

In an earlier version, the wrapper functionality was implemented as a set of ``setXHandler``,
where there would be worked with promises and ``once``.
This was an inferior idea, as the handler would only be called once on the event,
and could not be reused for multiple request streams and/or client sessions.
This lack of functionality triggered the idea to wrap the ``connect`` and ``request``-methods,
rather than only the ``on(event, ...)`` per session or stream.

## Attack Server

This repository also contains a way to quickly initialize HTTP/1.1- and HTTP/2.0-servers for certain
malicious configurations.
The code is structured so that it is possible to expand upon this.
It is all based around the ``AttackServer`` class.
The decision for an HTTP/1.1, or a secured HTTP/2.0 server are made by the
specific arguments to be given in the constructor, or the type between angle brackets:

```ts
import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2'
 
const httpPort = 8080;
const http2SecurePort = 8443;

// Initialize an unsecured HTTP/1.1-server
const httpServer = new AttackServer<Server>(
  httpPort,
  new AttackServerHttpFactory(),
  [], // the initializers
);

// Initialize a secured HTTP/2.0-server
const http2Server = new AttackServer<Http2SecureServer>(
  http2SecurePort,
  new AttackServerHttp2SecureFactory(),
  [], // the initializers
);
```

There is no factory for HTTP/2.0-servers over raw TCP,
as almost all HTTP/2.0 servers in real life situations use TLS.
Although the specs allow it, almost all major browsers (and even cURL)
will refuse to talk to an unsecured HTTP/2.0-server.
This was, however, included in an earlier phase of development.

To make a server attack in certain ways, the server initializer array
can be populated with ``AttackServerInitializer``s,
of which some examples are included under ``src/attack-server/attack-server-initializer``.

## Response Generator

Some of the ``AttackServerInitializer``s rely on instances of ``ResponseGenerator`` to
form the necessary ``headers`` and ``body`` objects.
There are two ``StandardResponseGenerator`` factory functions to make the distinction between HTTP/1.1 and HTTP/2.0

The response generators were made after an initial implementation of a very simple attack server.
Further development required the decoupling of different parts of the code,
which is why there is now ``src/attack-server`` and ``src/response-generator``,
instead of the earlier ``src/infinite-server`` (which only implemented one possible attack vector).

## Victim Client

Victim client as a CLI-tool that was used for swiftly testing of some attack server functionality.
It can still be used to manually test the functionality of Node.js HTTP/2.0-clients,
but serves no further purpose.
