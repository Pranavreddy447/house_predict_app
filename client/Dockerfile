# Stage 1: Base
FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Test
FROM base as test
COPY . .
CMD ["npm", "run", "test"]

# Stage 3: Build
FROM base as build
COPY . .
RUN npm run build

# Stage 4: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
