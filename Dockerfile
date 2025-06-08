FROM node:18-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript@5.8.3

# Copy source and build
COPY . .
RUN npm run build

# Set environment
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
