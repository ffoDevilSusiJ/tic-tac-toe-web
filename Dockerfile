# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG REACT_APP_WS_URL
ARG REACT_APP_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline

# Copy source code
COPY . .

# Build application
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
