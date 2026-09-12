FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

USER node

EXPOSE 8080
CMD ["node", "--import=tsx", "./src/app.ts"]
