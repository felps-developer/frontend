# Etapa de build
FROM node:20-buster AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de produção
FROM node:20-buster
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/public public
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/node_modules node_modules

# Expor a porta do frontend
EXPOSE 80

# Iniciar a aplicação com o Next.js
CMD ["npm", "run", "start"]
