# dev.Dockerfile for client/frontend
FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY tsconfig.json vite.config.ts ./
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]