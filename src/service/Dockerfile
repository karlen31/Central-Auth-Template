FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for build
RUN npm install

# Copy service source code
COPY . ./

# Build TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production

CMD ["npm", "start"] 