# sphere-api-stack/urbverde-ui/Dockerfile
# Accept NODE_VERSION as a build argument
ARG NODE_VERSION
FROM node:${NODE_VERSION} as builder
# FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy nvmrc file first
COPY .nvmrc ./

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