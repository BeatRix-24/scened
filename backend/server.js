// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
            "/day11/frame01.png",
            "/day11/frame02.png",
            "/day11/frame03.png",
            "/day11/frame04.png",
            "/day11/frame05.png",
            "/day11/frame06.png"
        ]
    },
    {
        title: "Deewaar",
        frames: [
            "/day12/frame01.png",
            "/day12/frame02.png",
            "/day12/frame03.png",
            "/day12/frame04.png",
            "/day12/frame05.png",
            "/day12/frame06.png"
        ]
    },
    {
        title: "Talvar",
        frames: [
            "/day13/frame01.png",
            "/day13/frame02.png",
            "/day13/frame03.png",
            "/day13/frame04.png",
            "/day13/frame05.png",
            "/day13/frame06.png"
        ]
    },
    {
        title: "Dhoom",
        frames: [
            "/day14/frame01.png",
            "/day14/frame02.png",
            "/day14/frame03.png",
            "/day14/frame04.png",
            "/day14/frame05.png",
            "/day14/frame06.png"
        ]
    },
    {
        title: "Johnny Gaddaar",
        frames: [
            "/day15/frame01.png",
            "/day15/frame02.png",
            "/day15/frame03.png",
            "/day15/frame04.png",
            "/day15/frame05.png",
            "/day15/frame06.png"
        ]
    }
];

// Random movie endpoint
app.get('/api/random-movie', async (req, res) => {
    try {
        if (!movies || movies.length === 0) {
            console.error('Movies array is empty.');
            return res.status(404).json({ error: 'No movies available' });
        }

        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const movieWithFullPaths = {
            title: randomMovie.title,
            frames: randomMovie.frames.map(frame => `${baseUrl}/static${frame}`)
        };

        console.log('Random movie selected:', movieWithFullPaths);
        res.json(movieWithFullPaths);
    } catch (error) {
        console.error('Error serving random movie:', error);
        res.status(500).json({ error: 'Failed to get random movie' });
    }
});

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

app.get('/api/suggest-movie', (req, res) => {
    const query = req.query.q.toLowerCase();
    
    // Get the movie titles from the `movies` array dynamically
    const movieTitles = movies.map(movie => movie.title);
    
    const suggestions = movieTitles.filter(movie =>
      movie.toLowerCase().includes(query)
    );
    
    res.json(suggestions);
});