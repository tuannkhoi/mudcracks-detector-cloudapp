FROM nikolaik/python-nodejs:python3.8-nodejs14

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
RUN pip install https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow_cpu-2.6.0-cp38-cp38-manylinux2010_x86_64.whl

# Export port to outside world
EXPOSE 4001

# Start command as per package.json
WORKDIR /mudcracks/server-express
# Start command as per package.json
CMD ["npm", "startAll"]
