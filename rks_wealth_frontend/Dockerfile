# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app (Export for static hosting)
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Copy built frontend from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
