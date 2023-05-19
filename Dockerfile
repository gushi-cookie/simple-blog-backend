FROM node:19.6.1

WORKDIR /app
EXPOSE 8080/tcp

RUN apt update
RUN apt -y install tzdata

CMD npm run dev