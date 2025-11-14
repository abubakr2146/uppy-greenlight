# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /app



# Copy package files first to leverage Docker cache
COPY package*.json .

# Install dependencies (use legacy-peer-deps to handle Uppy version conflicts)
RUN npm ci --legacy-peer-deps

# Copy all other files
COPY . .

# Build the application (now Vite will see env vars)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
