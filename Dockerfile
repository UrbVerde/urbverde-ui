# sphere-api-stack/urbverde-ui/Dockerfile

# Build stage
FROM node:22.12.0 as builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./ 
RUN npm install

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the app
FROM nginx:1.21.6-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf