# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# dev stage
FROM node:lts-alpine3.15 as dev-stage
WORKDIR /
COPY package*.json ./
COPY . .
RUN npm install
RUN chown -R node:node /node_modules
EXPOSE 8080
CMD ["npm", "run", "dev"]

