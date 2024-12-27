// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://34.93.164.60', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Serve static files from the movies directory
const staticPath = path.join(__dirname, 'movies');
console.log('Static files path:', staticPath);

app.use('/static', (req, res, next) => {
    console.log('Static file requested:', req.url);
    next();
}, express.static(staticPath, {
    maxAge: '1d',
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
    }
}));
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
    }
];


let currentMovieIndex = 0; // Tracks the current movie index

app.get('/api/next-movie', (req, res) => {
    try {
        const movie = movies[currentMovieIndex];
        
       const movieWithFullPaths = {
    title: movie.title,
    frames: movie.frames.map(frame => `http://34.93.164.60/static${frame}`)  // Changed from 3001 to 80
};
        console.log('Sending movie:', movieWithFullPaths);

        currentMovieIndex = (currentMovieIndex + 1) % movies.length;

        res.json(movieWithFullPaths);
    } catch (error) {
        console.error('Error serving next movie:', error);
        res.status(500).json({ error: 'Failed to get the next movie' });
    }
});

app.get('/api/suggest-movie', (req, res) => {
    try {
        const query = req.query.q;
        console.log('Suggestion query received:', query);

        if (!query) {
            console.log('No query provided');
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const movieTitles = movies.map(movie => movie.title);
        const suggestions = movieTitles
            .filter(title => title.toLowerCase().includes(query.toLowerCase()));

        console.log('Sending suggestions:', suggestions);
        res.json(suggestions);
    } catch (error) {
        console.error('Error in suggest-movie endpoint:', error);
        res.status(500).json({ error: 'Failed to fetch movie suggestions' });
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://34.93.164.60:${PORT}`);
});
