# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build the application
RUN npm run build 

# Expose port if needed
EXPOSE 3000

# Start command
CMD ["npm", "start"]
