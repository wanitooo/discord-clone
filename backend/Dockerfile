# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Clone the Git repository
RUN git clone https://github.com/wanitooo/discord-clone.git . 

WORKDIR /usr/src/app/backend

# Install application dependencies
RUN npm install

# Build the backend application
RUN npm run build

# Expose the port that your application runs on
EXPOSE 3000

# Start the application (adjust if you are using a different script)
CMD ["node", "dist/src/main.js"]
