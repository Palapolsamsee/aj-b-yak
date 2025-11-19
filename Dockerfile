FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    NITRO_PORT=3000 \
    HOST=0.0.0.0

# Copy only the Nuxt output assets; the project is assumed to be built already.
COPY .output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
