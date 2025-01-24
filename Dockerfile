FROM node:22.12.0 as builder
WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]