FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN npm install --ignore-scripts=false --verbose sharp
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY ./public ./public
COPY --chown=nextjs:nodejs ./.next ./.next
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
