# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app-nginx

# Copy package.json and package-lock.json first (ensures caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable for port
ENV PORT=4000

# Expose port (it will be overridden in Docker Compose)
EXPOSE 4000

# Run the app
CMD ["node", "server.js"]
