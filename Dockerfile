FROM node
WORKDIR /helo
COPY . /helo
RUN npm install
CMD ["npm","start"]