FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm clean-install --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
