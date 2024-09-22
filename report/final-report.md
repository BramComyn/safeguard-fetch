# Safeguard Fetch: Final Report

This document is meant as a means to justify what work and research has been done to come to the final result.
In a way, it could also be related to [this report](../docs/safeguard-fetch-documentation.md) on the architectural
decisions made during the development and may have some overlapping content.

## "Safeguard Fetch"

The name of the project refers to the fact that the ultimate goal is to integrate certain safeguards in fetching
resources for automatic querying engines, like [Comunica](https://github.com/comunica/comunica).
The name was chosen at a moment where it wasn't clear whether or not the wrapper or hooks would be written for the
Node.js's ``http`` or ``http2`` module, or for JS's standard ``Fetch API``.
Later that day (even later that same meeting), we decided to focus on Node.js's ``http2`` module and offer as much
support as possible for the ``http`` module, but I didn't think renaming the repository would be necessary.

## First week: working in on HTTP/2.0 and friends

My first week of work focused on reading and writing documentation,
mostly to try and figure out what possible attack vectors where,
or what could already be solved by just studying the documentation in more detail.
This work started by [reading a few articles](https://github.com/BramComyn/safeguard-fetch/issues/1) suggested to me.
The [first article](https://rubensworks.github.io/article-ldtraversal-security/)listed in the linked issue is the most
important, as it provides a list of possible security vulnerabilities and mitigations.
While reading, I decided to focus on the concept of an infinite RDF-document,
as this was the easiest to reproduce and illustrate.
By the end of my first week, I had:

- noticed [some differences in behavior](../docs/content-length-considerations-updated-2024-09-06)
of different HTTP-clients;
- documented [the life cycle of an HTTP/2.0 request](../docs/http2-request-lifecycle);
- written [a simple attack server](https://github.com/BramComyn/safeguard-fetch/pull/7)
providing a response with an infinite body.

The goal of this week was to provide myself with the necessary information to write the requested functionality.
I did this by testing different scenarios in TypeScript and writing some playground code,
of which most of [the playgrounds](../scripts/playgrounds/) are the final result.

### Perception of week 1

During the first week, it was sometimes awkward getting stuck *not knowing* what to do or how to proceed.
When I noticed this, I reached out and was supported really well.
This made me very enthusiast going into the end of the first week and really allowed me to grow into this work.
