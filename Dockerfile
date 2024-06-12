# Use an official Node.js runtime as the base image
FROM node:22

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose port 3001 for the application
EXPOSE 3001

# Define the command to run the application
CMD [ "npm", "start" ]