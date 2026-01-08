FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install typescript

COPY . .

RUN npx tsc && ls dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
