FROM node:12-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add python make gcc g++ && npm ci
COPY . .
RUN /app/node_modules/.bin/ng build --prod --configuration docker


FROM nginx:1.17-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/se-frontend-angular /usr/share/nginx/html
