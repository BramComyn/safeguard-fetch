# Content length considerations - update 2024-09-06

This document will delve deeper into what was discovered in the [previous version](https://github.com/BramComyn/blob/main/etc/content-length-considerations.md).
I will focus on what has been described in [this issue](https://github.com/BramComyn/safeguard-fetch/issues/20).

For each of the clients listed hereunder, I will look into their behavior for
the following cases:

| pathname                     | actual message size (bytes) | advertised ``content-length`` (bytes) |
| ---------------------------- | --------------------------- | ------------------------------------- |
| small difference             | 200                         | 100                                   |
| large difference             | 200                         | 10                                    |
| infinite difference          | infinity                    | 200                                   |
| no content length (finite)   | 200                         | /                                     |
| no content length (infinite) | infinity                    | /                                     |
| no-difference                | 200                         | 200                                   |

This is the same table as defined in the aforementioned issue.
I will be using my ``AttackServer`` class to send the messages.

To check what happens when the content length is shorter than advertised, I
made the paths ``/small-difference-inverse``, ``/large-difference-inverse`` and
``/no-content-length-finite-inverse`` which switches the actual size and the
advertised size from their counterparts in the above table.

## Chrome

I am testing Chrome for Ubuntu 24.04 (Noble Numbat).
Browser version:

```txt
128.0.6613.113 (Official Build) (64-bit)
```

### Chrome-HTTP/1.1

This doesn't pose a single problem. Chrome protects the user from receiving any
extra bytes when the ``content-length`` header is set to *b* bytes, only *b*
bytes will be found. The only problem I have found, is that Chrome doesn't treat
an invalid ``content-length`` header as an unrecoverable error, but rather cuts
off the remaining data. This is, however, specified behavior, according to
[RFC 9112$6.3](https://www.rfc-editor.org/rfc/rfc9112.html#name-message-body-length):

> ...
> If the final response to the last request on a connection has been completely
> received and there remains additional data to read, a user agent MAY discard
> the remaining data or attempt to determine if that data belongs as part of the
> prior message body, which might be the case if the prior message's
> Content-Length value is incorrect. A client MUST NOT process, cache, or
> forward such extra data as a separate response, since such behavior would be
> vulnerable to cache poisoning.
>
> ## 7. Transfer Encodings
>
> ...

### Chrome-HTTP/2.0

- small difference: doesn't cut off
- large difference: doesn't cut off
- infinite difference: doesn't cut off
- no content length finite: works like a charm
- no content length infinite: infinite data, works like a charm
- no difference: works like a charm.

### Shorter messages for Chrome

For both HTTP/1.1 and HTTP/2.0, the client keeps waiting for more data to
arrive when requesting the small difference path. For the larger difference,
Chrome returns the response string and finishes in HTTP/2.0, but doesn't do so
for HTTP/1.1. The no content length paths don't throw any errors.

## Firefox

I am testing Firefox for Ubuntu 24.04 (Noble Numbat).
Browser version:

```txt
Version 1300 (64-bit)
Mozilla Firefox Snap for Ubuntu
canonical-002 - 1.0
```

### Firefox-HTTP/1.1

Here fits the same answer as for Chrome over HTTP/1.1. I will not elucidate any
further.

### Firefox-HTTP/2.0

- small difference: cuts off as it would for HTTP/1.1
- large difference: cuts off message like it would for HTTP/1.1
- infinite difference: crashes
- no content length finite: works like a charm
- no content length infinite: infinite data, works like a charm
- no difference: works like a charm.

### Shorter messages for Firefox

This behaves exactly the same as for Chrome, surprisingly enough (to me).

## cURL

``curl --version`` returns this output:

```txt
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.7
Release-Date: 2023-12-06, security patched: 8.5.0-2ubuntu10.3
Protocols: dict file ftp ftps gopher gophers http https imap imaps ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd
```

I am thus using cURL 8.5.0.

### cURL-HTTP/1.1

Here fits, once again, the exact same answer as for Chrome over HTTP/1.1.

### cURL-HTTP/2.0

- small difference: crashes
- large difference: crashes
- infinite difference: crashes, and crashes my server too
- no content length finite: works like a charm
- no content length infinite: infinite data, works like a charm
- no difference: works like a charm.

### Shorter messages

For HTTP/1.1, cURL returns with an error code (18) for the large and no content
length paths, specifying the amount of bytes remaining to read, but doesn't do
so for the small difference path.

For HTTP/2.0, the small difference path behaves the same. The large difference
throws error 92 and specifies that the stream was not closed properly
(``PROTOCOL_ERROR (err1)``). The path without content throws error 52
``Empty reply from server``

## Node.js

I am using Node.js version ``v20.11.1`` on Ubuntu 24.04 (Noble Numbat). I will
use my ``VictimClient`` cli to quickly test its behavior. This does mean that I
currently will not have any idea what cURL will do for the HTTP/1.1 version.

### Node.js-HTTP/1.1

- small difference: crashes
- large difference: crashes
- infinite difference: crashes
- no content length finite: works like a charm
- no content length infinite: infinite data, works like a charm
- no difference: works like a charm

The way the Node.js client crashes is peculiar, as it throws a parser error
whenever something unexpected happened with a packet. See below for an example.
This also happens when the headers are flushed before the first data arrives.

> Error: Parse Error: Expected HTTP/
> at Socket.socketOnData (node:_http_client:535:22)
> at Socket.emit (node:events:518:28)
> at Socket.emit (node:domain:488:12)
> at addChunk (node:internal/streams/readable:559:12)
> at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
> at Socket.Readable.push (node:internal/streams/readable:390:5)
> at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
> bytesParsed: 250,
> code: 'HPE_INVALID_CONSTANT',
> reason: 'Expected HTTP/',
> rawPacket: Buffer(350) [Uint8Array] [
> 72,  84,  84,  80,  47,  49,  46,  49,  32,  50,  48,  48,
> 32,  79,  75,  13,  10,  99, 111, 110, 116, 101, 110, 116,
> 45, 116, 121, 112, 101,  58,  32, 116, 101, 120, 116,  47,
> 112, 108,  97, 105, 110,  13,  10,  99, 111, 110, 116, 101,
> 110, 116,  45, 108, 101, 110, 103, 116, 104,  58,  32,  49,
> 48,  48,  13,  10,  68,  97, 116, 101,  58,  32,  77, 111,
> 110,  44,  32,  48,  57,  32,  83, 101, 112,  32,  50,  48,
> 50,  52,  32,  48,  55,  58,  50,  52,  58,  48,  57,  32,
> 71,  77,  84,  13,
> ... 250 more items
> ]
> }

### Node.js-HTTP/2.0

- small difference: crashes
- large difference: crashes
- infinite difference: crashes
- no content length finite: works like a charm
- no content length infinite: infinite data, works like a charm
- no difference: works like a charm.

### Shorter messages for Node.js

For HTTP/1.1, the small difference path keeps waiting, like before. The larger
difference path returns the message, waits and then closes without error, like
the browser did before. The path without content does the same. This means that
for HTTP/1.1, Node.js behaves in the same way as browsers do for shorter
messages than the content length header advertises.

For HTTP/2.0, the small difference path keeps idle, like before.
The large difference and zero content path closes the stream with a protocol
error, like what happened in cURL.
