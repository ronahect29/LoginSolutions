FROM node:20-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache curl
#ENV NODE_ENV=development

COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 4000
CMD [ "npm", "run", "start" ]