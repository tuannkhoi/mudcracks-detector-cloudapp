FROM nikolaik/python-nodejs:python3.8-nodejs14

# Update
RUN apt-get -y update

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
RUN pip install -r requirements.txt
# libgl1 for opencv
RUN apt-get install -y libgl1


# Export port to outside world
# EXPOSE 4001

# Start 2 servers
WORKDIR /mudcracks/server-express
CMD npm run startAll