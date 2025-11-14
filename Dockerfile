# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /app



# Copy package files first to leverage Docker cache
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy all other files
COPY . .

# Build the application (now Vite will see env vars)
RUN npm run build

# Stage 2: Serve the application using Express server
FROM node:18-alpine

WORKDIR /app

# Copy built assets and server files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
