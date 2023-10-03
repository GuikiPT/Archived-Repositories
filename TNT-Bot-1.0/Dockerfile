FROM alpine:latest

RUN apk update
RUN apk --no-cache add nodejs npm yarn curl git wget bash

COPY ./ /workspace/TNT
WORKDIR /workspace/TNT