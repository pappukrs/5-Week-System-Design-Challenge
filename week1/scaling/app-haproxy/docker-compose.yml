version: "3"

services:
  node-app:
    build: .
    environment:
      - PORT=3000
    deploy:
      replicas: 3  # Run 3 instances
    networks:
      - app-network

  haproxy:
    image: haproxy:latest
    ports:
      - "80:80"
    volumes:
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
    depends_on:
      - node-app
    networks:
      - app-network

networks:
  app-network:
