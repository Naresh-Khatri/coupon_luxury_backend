FROM node:18

RUN apt-get update && apt-get install -y 

WORKDIR /usr/src/app

COPY package*.json .
COPY yarn.lock .

RUN yarn install
RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
