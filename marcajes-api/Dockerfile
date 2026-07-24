FROM node:20-alpine

WORKDIR /usr/src/app
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
#RUN npx prisma migrate deploy # SOLO EN PRODUCCION
RUN npm run build
EXPOSE 4100
CMD ["npm", "run", "start"]
#CMD ["sh", "-c", "npx prisma generate && npm run dev"]
