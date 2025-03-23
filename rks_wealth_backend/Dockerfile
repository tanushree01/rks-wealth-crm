# Use an Alpine-based Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose backend port (change it if needed)
EXPOSE 5000

# Start the backend
CMD ["node", "app.js"]
