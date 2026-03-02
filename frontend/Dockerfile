# Base image
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# bağımlılıkları yükle
RUN npm install

# tüm dosyaları kopyala
COPY . .

# build al
RUN npm run build

# port
EXPOSE 3000

# başlat
CMD ["npm", "run", "start"]