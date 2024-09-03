# HTTP/2-request life cycle in the Node.js ``http2``-module

This is strongly based off of the [API-documentation](https://nodejs.org/api/http2.html).
We will describe all events that are usually emitted during the processing of a normal GET-request
via ``client.request()`` from the client's point of view.
We'll consider [this example](https://nodejs.org/api/http2.html#client-side-example) as top-level example.

## Client side session events

Normal users will start their client side by creating a ``ClientHttp2Session`` via

```ts
const client = http2.connect('https://example.org');
```

Once connected to the server, this session will emit a ``connect``-event.
Once the connection has been destroyed, this session will emit a ``close``-event.
For normal users, all their requests will thus start (resp. end) with a ``connect``-
(resp. ``close``-)event emitted by this session.

Whenever something goes wrong during the session processing, an ``error``-event will be emitted.
Likewise, when something goes wrong while attempting to send a frame that cannot be associated
to a specific ``Http2Stream``, a ``frameError``-event will be emitted.
In this case, the entire ``Http2Session`` will be shut down following this event.

The ``timeout``-event will be emitted when the session's time-out is reached
after not registering any activity during a configured amount of time.

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

Once the client's session is connected, it can open a ``ClientHttp2Stream``
via the ``clienthttp2session.request()``-method
(or in response to a ``push``-event, see [later](#client-side-stream-events)).
This will make the session emit a ``stream``-event.
Next, we describe the possible events emitted by such streams.

### TL;DR

| Event name         | Reason for emission                              |
| ------------------ | ------------------------------------------------ |
| ``connect``        | session connected to server                      |
| ``close``          | session destroyed                                |
| ``error``          | something went wrong during session processing   |
| ``frameError``     | something went wrong with a frame                |
| ``timeout``        | no activity in session during set amount of time |
| ``goaway``         | ``GOAWAY`` frame received                        |
| ``localSettings``  | ``ACK`` for ``SETTINGS`` frame received          |
| ``remoteSettings`` | ``SETTINGS`` frame received                      |
| ``ping``           | ``PING`` frame received                          |
| ``altsvc``         | ``ALTSVC`` frame received                        |
| ``origin``         | ``ORIGIN`` frame received                        |

## Client side stream events

Once the stream is ready for use a ``ready``-event will be emitted.
When it is destructed, there will be a ``close``-event emitted by the stream in the same way as a session's ``close``,
but this will only affect the corresponding stream.
When a ``frameError`` in a session occurs that can be associated to a certain stream,
only that stream will be shut down instead of the entire corresponding session.

Because of inheritance, when a ``Http2Stream`` shuts down, it will also emit an ``end``-event.
If the stream was destroyed for a specific ``Error``, it might also emit an ``error``-event.
The ``aborted``-event will be emitted when a stream is abnormally aborted mid-communication.
This will only be done so when the writable side of the stream has not been ended.
The ``timeout``-event can also be emitted by a stream in an analogue manner as it can be by a session.

A stream van also emit two different events in the context of trailers:

- ``trailers``: when a block of headers associated with trailing header fields is received;
- ``wantTrailers``: when final ``DATA``-frame is queued to be sent and the stream is ready to send trailing headers.

### Specifally for ``ClientHttp2Stream``

There's specific events for when a client stream receives extra information:

- ``continue``: emitted when ``100 Continue`` is received;
- ``headers``: emitted when additional header blocks are received (e.g. ``1xx`` blocks);

In the same way, there are two events for when the client stream receives a response (whether it be via a push or not):

- ``push``: emitted response headers for Server Push Stream received;
- ``response``: emitted when response ``HEADERS``-frame has been received for the stream.

### TL;DR

| Event name       | Reason for emission                                                            |
| ---------------- | ------------------------------------------------------------------------------ |
| ``ready``        | stream is ready for use                                                        |
| ``close``        | stream is destroyed                                                            |
| ``end``          | stream is destroyed (inherited from ``stream.Duplex``)                         |
| ``error``        | something went wrong                                                           |
| ``frameError``   | something went wrong with a frame that is associated to this stream            |
| ``aborted``      | stream is abnormally aborted mid-communication, writable side not ended        |
| ``timeout``      | no activity in stream during set amount of time                                |
| ``trailers``     | block of headers associated with trailer fields received                       |
| ``wantTrailers`` | final ``DATA`` frame queued for send, stream is ready to send trailing headers |
| ``continue``     | ``100 Continue`` received                                                      |
| ``headers``      | headers in ``1xx`` range received                                              |
| ``push``         | response headers for Server Push Stream received                               |
| ``response``     | response ``HEADERS`` frame received                                            |
