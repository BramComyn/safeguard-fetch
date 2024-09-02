# HTTP/2-request life cycle in the Node.js ``http2``-module

This is strongly based off of the [API-documentation](https://nodejs.org/api/http2.html).
We will describe all events that are usually emitted during the processing of a normal GET-request via ``client.request()`` from the client's point of view. We'll consider [this example](https://nodejs.org/api/http2.html#client-side-example) as top-level example.

## Client side session events

Normal users will start their client side by creating a ``ClientHttp2Session`` via

```ts
const client = http2.connect('https://example.org');
```

Once connected to the server, this session will emit a ``connect``-event. Once the connection has been destroyed, this session will emit a ``close``-event. For normal users, all their requests will thus start (resp. end) with a ``connect``- (resp. ``close``-)event emitted by this session.

Whenever something goes wrong during the session processing, an ``error``-event will be emitted. Likewise, when something goes wrong while attempting to send a frame that cannot be associated to a specific ``Http2Stream``, a ``frameError``-event will be emitted. In this case, the entire ``Http2Session`` will be shut down following this event.

The ``timeout``-event will be emitted when the session's time-out is reached after not registering any activity during a configured amount of time.

There are a few other events that can be emitted as a result of receiving certain types of frames:

### In general for ``Http2Session``

- ``goaway``: instantly shuts down the session when a ``GOAWAY``-frame is received;
- ``localSettings``: emitted when an acknowledgment of a sent ``SETTINGS``-frame is received;
- ``remoteSettings``: emitted when a ``SETTINGS``-frame is received;
- ``ping``: emitted when a ``PING``-frame is received.

### Specifically for ``ClientHttp2Session``

- ``altsvc``: emitted when an ``ALTSVC``-frame is received;
- ``origin``: when an ``ORIGIN``-frame is received;

### Opening a stream: the normal way to go

Once the client's session is connected, it can open a ``ClientHttp2Stream`` via the ``clienthttp2session.request()``-method. This will make the session emit a ``stream``-event. Next, we describe the possible events emitted by such streams.

## Client side stream events
