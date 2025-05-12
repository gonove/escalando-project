FROM node:18.16 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g ts-node

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]