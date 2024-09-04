# Current considerations/questions concerning the content length

As you may have noticed, the past days I have been focussing on the possible problem of a discrepancy between the server's response
data size and what is specified in the ``Content-Length`` header.

As for HTTP/1.1 I have found that [RFC 9112 §6.2](https://www.rfc-editor.org/rfc/rfc9112#section-6.2) states the following:

> If a message is received without Transfer-Encoding and with an invalid Content-Length header field, then the message framing is invalid and the recipient MUST treat it as an unrecoverable error, unless the field value can be successfully parsed as a comma-separated list (Section 5.6.1 of [HTTP]), all values in the list are valid, and all values in the list are the same (in which case, the message is processed with that single value used as the Content-Length field value).
> If the unrecoverable error is in a request message, the server MUST respond with a 400 (Bad Request) status code and then close the connection. If it is in a response message received by a proxy, the proxy MUST close the connection to the server, discard the received response, and send a 502 (Bad Gateway) response to the client.
> If it is in a response message received by a user agent, the user agent MUST close the connection to the server and discard the received response.

I think this can explain the behaviour of both my Node.js client and Firefox, which both stop accepting data and close their streams with an error code.
The only problem I have right now, is that this behaviour is specified for HTTP/1.1, but I can't seem to find anything related to it in the specs for HTTP/2.0.
Yet, Node.js and Firefox both pose this behaviour no matter the HTTP-version.
Does this mean that this is undefined behaviour and is that the reason Google Chrome chooses just to ignore the ``content-length`` header in HTTP/2.0?

What should I do with this? Is it preferable to keep looking further in the RFCs, or are there more imminent issues that could be tackled?
