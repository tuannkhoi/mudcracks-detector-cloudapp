FROM node:erbium

# Copy app source
COPY /mudcracksdetection /src

# Set working directory to /src
WORKDIR /src

# Install app dependencies
RUN npm install

# Export port to outside world
EXPOSE 3000

# Start command as per package.json
CMD ["npm", "start"]