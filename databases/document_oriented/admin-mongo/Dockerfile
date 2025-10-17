FROM node:16

WORKDIR /usr/src/app

RUN git clone https://github.com/mrvautin/adminMongo.git . 

RUN npm install --legacy-peer-deps --omit=dev

COPY config/app.json /usr/src/app/config/app.json

EXPOSE 1234

CMD ["npm", "start"]