# Video Hosting Website Backend Project

## Overview

This project is a comprehensive backend application built using Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), bcrypt, and other essential libraries. It aims to create a scalable backend for a video hosting platform similar to YouTube. The project includes essential features such as user authentication, video management, user interactions (like, dislike, comment), subscription management, and more.

## Features

User Authentication: Secure user authentication and authorization using JWT (JSON Web Tokens) and bcrypt for password hashing.

User Management: Allows users to register, login, update profile information, and manage account settings.

Video Management: Enables users to upload videos, update video details, and manage their video library.

Social Interactions: Includes features like liking/disliking videos, commenting on videos, replying to comments, and viewing comment threads.

Subscription Management: Allows users to subscribe/unsubscribe to other users' channels and receive updates.

Pagination and Sorting: Implements pagination and sorting for efficient data retrieval, especially useful for videos, comments, and user lists.

Error Handling: Uses custom error handling middleware to ensure robust error management and consistent API responses.

Security Practices: Adheres to best security practices such as input validation, error handling, and secure password storage.

Technologies Used
Node.js: Server-side JavaScript runtime environment.

Express.js: Web application framework for Node.js, providing robust features for building APIs.

MongoDB: NoSQL database used for storing application data.

Mongoose: MongoDB object modeling tool for Node.js, providing schema-based modeling.

JWT: JSON Web Tokens for securely transmitting information between parties.

bcrypt: Password hashing function used to securely store user passwords.

## Installation
Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```
## Install dependencies:

```bash
npm install
```

## Set up environment variables:

Create a .env file in the root directory.
```
example: sample.env
```
## Start the server:
```bash
npm run dev
```
## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your suggested improvements. Ensure that your code follows the existing code style and passes all tests.