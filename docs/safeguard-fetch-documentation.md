# Safeguard-Fetch: a wrapper around Node.js's ``http2``-module

This document is meant as a complete documentation guide for the architecture
of my three-week project for IDLab. As suggested by Joachim V.H, I will be
explaining why certain decisions have been made, to ensure that no doubt remains
in further work on this repository. Should you still have any questions, then
I will always remain open to explain myself further.

## Goal

The goal of this repository was to provide developers of automatic querying
engines for linked data with a safer way of interacting with the ``http2``-
module of Node.js. It was necessary to provide certain hooks to this library,
so that developpers could write handler-functions for certain events/
event combinations.

## Wrapper

This repository provides such feature through its ``SafeguardRequester``-class.
This class is meant as a wrapper. The wrapper allows the user to define some
handlers that can be registered and will then automatically be set on every new
client session (new connection to a server) or new request stream (one duplex
stream to the connected server).

The idea behind this, is that adding the handler to this wrapper class provides
a smoother and more dynamic experience in requesting resources with certain
constraints. The configuration and combination of event handlers can differ per
instance of the wrapper class, making it possible to rapidly reuse different
constraints for different connections or even requests within those connections.

Behind the scenes, the wrapper will set event handlers to the requests and
clients, just as one would do when manually adding these straight to the
client or request. The clue is that is abstracted away and that the
user-written handlers have different signatures for the event as the handler
functions one would manually attach.

## Event handlers and their typings

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

In short: the handlers you have to write for the wrapper have the exact same
declaration and type signature, except for the addition of an extra argument,
being the client session or request stream.

## Why weren't there defined any custom typed event emitters?

As should be clear from the code and the above explanation, it would be useless
to define any custom typed event emitters, as they can server no purpose in the
architectural style I decided to implement. The types of the event handlers are
defined, but wrapping the client sessions or request streams would implicitly
mean a lot of hassle trying to do something in the ``http2``-module, without
doing so.

One would have to wrap the ``client`` or ``request`` in a new class, but then
you would already have the instance and you could use the normal way of
directly attaching the handler, which brings us back to why I wrote this whole
wrapper.

The type of such event emitters is already defined, but no classes adhering to
it have been implemented, as this would be a waste of time in the short period
of my work here.
