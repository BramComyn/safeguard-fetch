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

## Second week: a rudimentary wrapper implementation

During my second week of working, I laid the foundations of what ultimately became the wrapper.
I started by decoupling some code I wrote for the ``infinite-server``, based on the ideas that were given to me
in our meeting and Mattermost-chats.
I also kept documenting some more details in client behavior for this specific use case,
but extended my testing and playing around to also include the case of a faulty or malicious redirect.
Ultimately, I coded the ``setContentLengthHandler``, ``setNoContentLengthHandler`` and ``setRedirectHandler``.
It was clear that this approach wasn't the most durable, so that's why I decided to ask for more feedback.
This feedback is what led to the refactoring that took me most of my week, Wednesday through to Friday.

All of this work led to the types and classes defined under ``src/handler``,
as my earlier functions got rewritten into some examples of a more generic interface for allowing
the user to attach handlers in different cases.
This made me realise that I was not directly making a wrapper, yet more some examples of how my wrapper could be used.
I would go on to fix and demonstrate this one more time in my third week.

### Perception of week 2

This week was probably the most valuable to me in terms of learning TypeScript's typing system
and how to perform some very funky things with it.
I really want to thank the people that guided me in this,
as I would have probably given up if this was some personal side project
-- which sounds very dramatic, but in fact is the truth.

I felt more comfortable in getting stuck on something,
and I felt more at home in this research-type of work.

## Third week: ``SafeguardRequester`` - a testimony to learning TypeScript

The final result of my code is the ``SafeguardRequester`` class,
with the three most important methods being:

- ``connect``
- ``request``

and their combination in

- ``connectAndRequest``

These methods allow for repeated use of the different ``ClientEventHandler``s and ``ResponseEventHandler``s
that the user can define and set through the constructor and the respective methods.

Also in the final week, I fixed broken tests and bumped the coverage for all my files to 100%,
with both integration tests and unit tests for the wrapper.
I even included a more detailed example, albeit very rudimentary, flawed and NOT FIT FOR REAL USE.
However, it is tested, shows the functionality of the wrapper and the possibilities included through its use.

In short, the wrapper makes adding a complex amount of event handlers a bit easier for the user,
yet I still believe there is more possible work and improvements to be built in the wrapper and its usage.

### Perception of the third week

The third week was a bit more difficult, as it came with a bunch of
-- in my eyes complicated -- testing,
but in the end I managed to develop a strong set of tests that cover a plethora of possible
situations. I was very happy about my results, as I could compare to myself three weeks prior
and see what improvements I had made
in terms of practical experience.

## A word of thanks

I still wish to thank everyone who helped me in achieving this code.
To me, it was my first experience I got working in my own sector.
This work managed to convince myself entirely again of why I study this field and what sparked my interest in it.
I will enter the new year as a more complete and better computer scientist.
I also wish to thank prof. Verborgh again for introducing me in Web Development
and all its interesting and complex ideas and concepts.
I yearn to returning next summer and paving my way further into the open world of software development and research.
