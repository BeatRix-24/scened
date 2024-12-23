// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the movies directory
app.use('/static', express.static(path.join(__dirname, 'movies')));

// Movies data
const movies = [
    {
        title: "Gangs of Wasseypur",
        frames: [
            "/day1/frame01.jpg",
            "/day1/frame02.jpg",
            "/day1/frame03.jpg",
            "/day1/frame04.jpg",
            "/day1/frame05.jpg",
            "/day1/frame06.jpg"
        ]
    },
    {
        title: "Lunchbox",
        frames: [
            "/day2/frame01.jpg",
            "/day2/frame02.jpg",
            "/day2/frame03.jpg",
            "/day2/frame04.jpg",
            "/day2/frame05.jpg",
            "/day2/frame06.jpg"
        ]
    },
    {
        title: "Maqbool",
        frames: [
            "/day3/frame01.png",
            "/day3/frame02.png",
            "/day3/frame03.png",
            "/day3/frame04.png",
            "/day3/frame05.png",
            "/day3/frame06.png"
        ]
    },
    {
        title: "Chittagong",
        frames: [
            "/day4/frame01.png",
            "/day4/frame02.png",
            "/day4/frame03.png",
            "/day4/frame04.png",
            "/day4/frame05.png",
            "/day4/frame06.png"
        ]
    },
    {
        title: "Tere Naam",
        frames: [
            "/day5/frame01.png",
            "/day5/frame02.png",
            "/day5/frame03.png",
            "/day5/frame04.png",
            "/day5/frame06.png",
            "/day5/frame05.png"
        ]
    },
    {
        title: "Pyaar Ka Punchnama",
        frames: [
            "/day6/frame01.jpeg",
            "/day6/frame02.jpeg",
            "/day6/frame03.jpeg",
            "/day6/frame04.jpeg",
            "/day6/frame05.jpeg",
            "/day6/frame06.jpeg"
        ]
    },
    {
        title: "Newton",
        frames: [
            "/day7/frame01.jpeg",
            "/day7/frame02.jpeg",
            "/day7/frame03.jpeg",
            "/day7/frame04.jpeg",
            "/day7/frame05.jpeg",
            "/day7/frame06.jpeg"
        ]
    },
    {
        title: "M.S. Dhoni: The Untold Story",
        frames: [
            "/day8/frame01.jpeg",
            "/day8/frame02.jpeg",
            "/day8/frame03.jpeg",
            "/day8/frame04.jpeg",
            "/day8/frame05.jpeg",
            "/day8/frame06.jpeg"
        ]
    },
    {
        title: "Aligarh",
        frames: [
            "/day9/frame01.jpeg",
            "/day9/frame02.jpeg",
            "/day9/frame03.jpeg",
            "/day9/frame04.jpeg",
            "/day9/frame05.jpeg",
            "/day9/frame06.jpeg"
        ]
    },
    {
        title: "War",
        frames: [
            "/day10/frame01.jpeg",
            "/day10/frame02.jpeg",
            "/day10/frame03.jpeg",
            "/day10/frame04.jpeg",
            "/day10/frame05.jpeg",
            "/day10/frame06.jpeg"
        ]
    },
    {
        title: "Rang De Basanti",
        frames: [
            "/day11/frame01.jpg",
            "/day11/frame02.jpg",
            "/day11/frame03.jpg",
            "/day11/frame04.jpg",
            "/day11/frame05.jpg",
            "/day11/frame06.jpg"
        ]
    }
];

// Random movie endpoint
// app.get('/api/random-movie', (req, res) => {
//     try {
//         const randomMovie = movies[Math.floor(Math.random() * movies.length)];
//         const movieWithFullPaths = {
//             title: randomMovie.title,
//             frames: randomMovie.frames.map(frame => `http://localhost:${PORT}/static${frame}`)
//         };
//         console.log('Sending movie:', movieWithFullPaths);
//         res.json(movieWithFullPaths);
//     } catch (error) {
//         console.error('Error serving random movie:', error);
//         res.status(500).json({ error: 'Failed to get random movie' });
//     }
// });

let currentMovieIndex = 0; // Tracks the current movie index

app.get('/api/next-movie', (req, res) => {
    try {
        const movie = movies[currentMovieIndex];
        const movieWithFullPaths = {
            title: movie.title,
            frames: movie.frames.map(frame => `http://localhost:${PORT}/static${frame}`)
        };

        console.log('Sending movie:', movieWithFullPaths);

        // Increment the index and wrap around if it reaches the end
        currentMovieIndex = (currentMovieIndex + 1) % movies.length;

        res.json(movieWithFullPaths);
    } catch (error) {
        console.error('Error serving next movie:', error);
        res.status(500).json({ error: 'Failed to get the next movie' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});