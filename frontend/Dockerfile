# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Clone the Git repository
RUN git clone https://github.com/wanitooo/discord-clone.git . 

WORKDIR /usr/src/app/frontend

# Install application dependencies
RUN npm install

# Build the frontend application
RUN npm run build

# Expose the port that your application runs on (usually a frontend server like React runs on 3000)
EXPOSE 3001

# Start the application 
CMD ["npm", "run", "preview","--", "--port", "3001", "--host", "0.0.0.0"]
