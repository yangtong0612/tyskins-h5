FROM node:19.9.0-alpine3.18 AS builder

RUN yarn -v && yarn config set registry https://registry.npmmirror.com/

WORKDIR /build

COPY . .
RUN yarn install && yarn build

FROM nginx:latest

COPY --from=builder /build/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
