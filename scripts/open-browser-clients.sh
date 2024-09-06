#! /bin/bash

# Open the browser clients to the attack servers

paths=(
    "/"
    "/small-difference"
    "/large-difference"
    "/infinite-difference"
    "/no-content-length-finite"
    "/no-content-length-infinite"
    "/no-difference"
)

for path in "${paths[@]}"; do
    # open over HTTP/1.1
    firefox "http://localhost:8080$path" 2> /dev/null &
    google-chrome "http://localhost:8080$path" 2> /dev/null &

    # open over HTTP/2
    firefox "https://localhost:8443$path" 2> /dev/null &
    google-chrome "https://localhost:8443$path" 2> /dev/null &
done

exit 0
