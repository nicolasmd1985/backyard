FROM node:20-slim

WORKDIR /app

# Install system utilities needed for build
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy app code
COPY . .

# Expose Metro bundler and Web port
EXPOSE 8081

ENV CI=0
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]
