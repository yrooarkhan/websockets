FROM node:14.20.0-alpine3.15

RUN ["mkdir", "-p", "/app/websocket"]
WORKDIR /app/websocket
COPY . ./

RUN ["yarn", "install"]

EXPOSE 3000
CMD ["yarn", "start"]
