# LiteraryHub - SWE Backend README

This repository contains the backend code for the LiteraryHub plaform. It is built with Node.js, Express, and MongoDB. The application provides functionalities such as user authentication, book ratings, and managing book information. The backend code is responsible for handling all the server-side logic and database connections. The frontend code can be found in the [swe-frontend]() repository. 

## Overview

The LiteraryHub is a platform for book lovers. It provides functionalities such as user authentication, book ratings, and managing book information. This repository, `swe-backend`, contains all the server-side code and database connections. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB
- NPM

### Installing

1. Clone the repository to your local machine using the following command:

```sh
git clone https://github.com/literaryhub/swe-backend.git
```

2. Navigate to the project directory:

```sh
cd swe-backend
```

3. Run the following command to install all the dependencies:

```sh
npm install
```

### Database Setup

This application uses MongoDB as its database. You need to set up a MongoDB instance and provide the connection string in your environment variables.

Create a `.env` file in the root directory of the project and add the following:

```sh
DB_CONNECTION_STRING=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

### Running the Application

To start the server, run the following command:

```sh
npm start
```

The server will start on port 3001 or the port specified in your environment variables.

### Creating the docker image
Use the docker engine to build the image from current code:

This command will list details such as the image ID, repository, tag, and size for each image. It's useful for managing your Docker images, including removing old or unused ones to free up disk space.


Use the docker engine to create a docker container and run a particular image with image name:
```
docker build -t literaryhub_ai_backend_image:latest .
```

## Pushing the docker image to Docker Hub
After creating the image locally, you'll want to push it to Docker Hub as follows:

```bash
docker tag literaryhub_swe_backend_image:latest literaryhub/swe-backend:latest
docker push literaryhub/swe-backend:latest
```

### Running the docker image locally

Disclaimer: The host 0.0.0.0 specified in the Dockerfile does not accept connections locally.
In order to run the docker image locally, a local modification to the host specified in the Dockerfile
is necessary, to 127.0.0.1, but please do not submit this change because it is likely to break our
deployment process.

Use the docker engine to create a docker container and run a particular image:
```
sudo docker run -d -p 3001:3001 literaryhub_swe_backend_image:latest
```

To see all the containers that you have locally, run:

```
docker ps -a
```

To see what containers are current running, remove the `-a` parameter.

Notes: 
- In order to see the logs on the container, use its Container ID, e.g.,
```
docker logs <container_id>
```

After a container has been created with the previous command, you can stop/start it using the commands:
```
docker start <container_id>
sudo docker end <container_id>
```
Note: you can't reuse the same container name multiple times, even if you're running the same image.


## Features

- User Authentication: The application supports user authentication with different roles such as 'Reader', 'Author', and 'Publisher'. This is implemented in the [`User`](model/user.js) model.
- Book Ratings: Users can rate books. This is implemented in the [`RatingsReviews`](model/ratings.js) model.
- Book Information: The application manages book information such as title, author, summary, price, rating, and date. This is implemented in the [`Book`](model/main.js) model.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)