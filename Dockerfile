# specify a base image

FROM node:alpine

# specify the working directory where entire application will be copied

WORKDIR /home/event-manager

# install all the dependencies of the application
COPY ./package.json ./
RUN npm install
COPY ./ ./

# give a startup command

CMD ["npm","start"]