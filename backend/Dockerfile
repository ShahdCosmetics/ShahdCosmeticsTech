FROM node:20-bullseye

WORKDIR /app

# 1. Sadece package dosyalarını kopyala
COPY package*.json ./

# 2. Tüm dependencies'yi kur
RUN npm install

# 3. Prisma klasörünü kopyala
COPY prisma ./prisma/

# 4. Prisma Client'ı generate et
RUN npx prisma generate

# 5. Kalan dosyaları kopyala
COPY . .

# 6. Build al
#RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]