FROM node:19.6.1 as prod

ARG PORT
EXPOSE ${PORT}/tcp

WORKDIR /app
COPY ./ /app
RUN apt update && apt -y install tzdata
RUN npm run build

WORKDIR /var/www/app
RUN cp -r /app /var/www

CMD npm run start



FROM node:19.6.1 as dev

ARG PORT
EXPOSE ${PORT}/tcp

WORKDIR /app
RUN apt update && apt -y install tzdata

CMD npm run dev