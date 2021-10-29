FROM ubuntu:18.04

RUN apt-get -y update

# Install general dependencies
RUN apt-get install -y build-essential curl wget gnupg

# Install Python
RUN apt-get install -y python3.8 python3-pip libgl1
# libgl1 = dependency of python-opencv
# Upgrade pip3
RUN pip3 install --upgrade pip

# Install NodeJS 14
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get install -y nodejs

# Set working directory to /mudcracks
WORKDIR /mudcracks

# Copy app source
COPY . .

# Install client dependencies
WORKDIR /mudcracks/client
RUN npm i

# Install server-express dependencies
WORKDIR /mudcracks/server-express
RUN npm i

# Install server-flask dependencies
WORKDIR /mudcracks/server-flask
RUN pip3 install -r requirements.txt
# Fix locale error when flask run / error due to using python <= 3.6
ENV LC_ALL="en_US.utf-8"
ENV LANG="en_US.utf-8"

# Export port to outside world
EXPOSE 4001

# Start command as per package.json
WORKDIR /mudcracks/server-express
CMD npm-run-all --parallel startExpress startFlask
