# Scened - Movie Guessing Game

Scened is a fun movie guessing game where users can upload images of movie still frames, and others can guess the movie titles based on the images. It allows movie enthusiasts to engage with their favorite films by recognizing iconic frames. The application uses a Node.js backend with Express for handling API requests, Multer for file uploads, and a frontend built with HTML, CSS, and JavaScript.

## Table of Contents

- [Features](#features)
- [Frontend](#frontend)
- [Backend](#backend)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Users can upload up to 6 movie still frames along with a title.
- The frames are saved in a dynamic folder structure based on the day of the upload.
- Movie data, including title and frames, is stored in a JSON file (`movies.json`).
- Provides an API to retrieve a random movie and movie suggestions based on a search query.

## Frontend

The frontend of the application is built using:

- **HTML**: To structure the content and create forms for user interaction.
- **CSS**: For styling and providing a visually appealing layout.
- **JavaScript**: To handle dynamic interactions and make the game interactive, including uploading images and displaying movie frames.

### File Upload Form

The user can upload movie frames through a form in the frontend. The form allows users to select up to 6 images (with names like `frame01`, `frame02`, etc.) and provide a title for the movie. Once the form is submitted, the files are sent to the backend for storage.

### Game Interaction

Once the movie frames are uploaded and stored, users can view random frames and guess the movie titles. The game displays frames randomly and waits for the user to input their guess.

## Backend

The backend is built using:

- **Node.js**: The server-side platform that handles the requests.
- **Express.js**: The web framework for handling routing.
- **Multer**: A middleware for handling file uploads.

The server manages movie uploads, stores data in a `movies.json` file, and serves movie frames as static files.

### Endpoints

1. **POST /api/upload-movie**  
   - Upload movie still frames and movie title.  
   - Expects an array of 6 images (frame01, frame02, ..., frame06) and a movie title.

2. **GET /api/next-movie**  
   - Returns a random movie and its frames from the list of uploaded movies.
   
3. **GET /api/suggest-movie**  
   - Accepts a query parameter `q` and returns a list of movie titles that match the query.

## API Flow

### Upload Movie:
- The user uploads a movie along with 6 images (frames).
- The images are stored in the server under a unique directory based on the day of the upload.
- The movie data (title and frame paths) are saved in `movies.json`.

### Get Next Movie:
- The user can get a random movie by hitting the `/api/next-movie` endpoint.
- This will return a movie's title and the corresponding frame images.

### Search for Movie:
- Users can search for movies by partial title using the `/api/suggest-movie` endpoint.
- This endpoint will return a list of movie titles that match the search query.

## Installation

### Prerequisites

- Node.js and npm (Node Package Manager) must be installed on your machine.

### Steps to Set Up

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/scened.git
2.Navigate into project directory
  
  ```bash
  cd scened
  ```
3.Install necessary dependencies
 ```bash
  npm install express cors multer
  ```
4.Star the server
 ```bash
  cd backend
  node server.js
  ```
**Usage**
- Open the frontend in a browser (if running locally, go to http://localhost:3001).
- Use the form on the frontend to upload movie frames (6 frames) and provide a movie title.
- Once uploaded, the movie data is saved on the server, and you can view it through the game interface.
- You can also fetch random movie frames or search for movies by title using the backend API.
