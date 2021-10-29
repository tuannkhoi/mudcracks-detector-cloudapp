FROM ubuntu:18.04

RUN apt-get -y update

# Install system dependencies
RUN apt-get install -y build-essential curl wget gnupg

# Install Python
RUN apt-get install -y python3.8 python3-pip libgl1
# Upgrade pip3
RUN pip3 install --upgrade pip

# Install NodeJS 14
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get install -y nodejs

# Set working directory to /apppy
WORKDIR /app

# Copy app source
COPY . .

# Install client dependencies
RUN npm i

# Install server-express dependencies
RUN npm i

# Install server-flask dependencies
RUN pip3 install -r requirements.txt
# Fix locale error when flask run
ENV LC_ALL="en_US.utf-8"
ENV LANG="en_US.utf-8"


# Export port to outside world
EXPOSE 4001

# Start command as per package.json
CMD ["npm", "start"]