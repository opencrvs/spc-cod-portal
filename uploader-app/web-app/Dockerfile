# Stage 1: Build Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/web-app/dist /usr/share/nginx/html
COPY web-app/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT sh -c "/usr/share/nginx/html/vite-envs.sh && nginx -g 'daemon off;'"
