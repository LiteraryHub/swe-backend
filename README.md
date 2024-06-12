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

## Features

- User Authentication: The application supports user authentication with different roles such as 'Reader', 'Author', and 'Publisher'. This is implemented in the [`User`](model/user.js) model.
- Book Ratings: Users can rate books. This is implemented in the [`RatingsReviews`](model/ratings.js) model.
- Book Information: The application manages book information such as title, author, summary, price, rating, and date. This is implemented in the [`Book`](model/main.js) model.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

