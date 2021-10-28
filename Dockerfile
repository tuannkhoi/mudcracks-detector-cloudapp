FROM node:14-alpine

# Set working directory to /app
WORKDIR /app


# Copy app source
COPY . .

# Export port to outside world
EXPOSE 3000

# Start command as per package.json
CMD ["npm", "start"]