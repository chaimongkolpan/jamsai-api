FROM node:21.1.0

WORKDIR /app
COPY . .

EXPOSE 3001
RUN npm install
CMD ["npm", "run", "start"]