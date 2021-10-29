FROM ubuntu:18.04

RUN apt update && apt -y upgrade

# Install NodeJS 14.17.4

# Install Python 3.8.5

# Set working directory to /app
WORKDIR /app

# Install JS dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install python dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy app source
COPY . .

# Export port to outside world
EXPOSE 4001

# Start command as per package.json
CMD ["npm", "start"]