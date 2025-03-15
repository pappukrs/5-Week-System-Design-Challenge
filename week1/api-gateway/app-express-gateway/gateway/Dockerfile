FROM node:18
WORKDIR /gateway
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npx", "eg", "gateway", "start"]
