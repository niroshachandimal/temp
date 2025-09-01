# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json file
COPY package.json ./

# Install AWS CLI to fetch CodeArtifact token
RUN apk add --no-cache aws-cli

# Authenticate with AWS CodeArtifact
ARG CODEARTIFACT_AUTH_TOKEN
RUN npm config set registry "https://aplicy-339713138420.d.codeartifact.us-east-1.amazonaws.com/npm/aplicy-codeartifact/"
RUN npm config set //aplicy-339713138420.d.codeartifact.us-east-1.amazonaws.com/npm/aplicy-codeartifact/:_authToken=${CODEARTIFACT_AUTH_TOKEN}

# Install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3070

# Start the application
CMD ["npm", "run", "start"]
