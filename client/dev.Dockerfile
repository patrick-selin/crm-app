# client/frontend
FROM node:20.11.1-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
# ENV VITE_API_BASE_URL=http://localhost:3333

RUN npm install

COPY . .

EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["npm", "run", "dev"]
