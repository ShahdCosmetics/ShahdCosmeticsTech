FROM node:20-bullseye

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy Prisma schema and generate the client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy remaining source files
COPY . .

# Use nest start for development - no build step required
CMD ["npx", "nest", "start"]