FROM node:18.8.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD node src/index

ENV DBUrl="mongodb+srv://gxgemini777:apollo777@wildlens.0vgoc5r.mongodb.net/main?retryWrites=true&w=majority"
ENV CLOUDINARY_CLOUD_NAME=dzfgxmkid
ENV CLOUDINARY_KEY=441187618226843
ENV CLOUDINARY_SECRET=ROp5dSuf8zZWEmE8k3eAFtAYvKM
