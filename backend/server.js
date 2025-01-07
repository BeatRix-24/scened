const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helper function to load movies data
async function loadMoviesData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'movies.json'), 'utf8');
        const parsedData = JSON.parse(data);
        return parsedData.movies || [];
    } catch (error) {
        console.error('Error loading movies data:', error);
        return [];
    }
}

// Helper function to save movies data
async function saveMoviesData(movies) {
    await fs.writeFile(
        path.join(__dirname, 'movies.json'),
        JSON.stringify({ movies }, null, 2)
    );
}

// Initialize storage configuration
const storage = multer.diskStorage({
    async destination(req, file, cb) {
        try {
            const movies = await loadMoviesData();
            const dayNumber = movies.length + 1;
            const uploadDir = path.join(__dirname, 'movies', `day${dayNumber}`);
            await fs.mkdir(uploadDir, { recursive: true });
            
            // Store dayNumber in request object for later use
            req.dayNumber = dayNumber;
            
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename(req, file, cb) {
        // Get frame number from original field name (frame1, frame2, etc.)
        const frameNumber = file.fieldname.replace('frame', '');
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `frame${String(frameNumber).padStart(2, '0')}${extension}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).fields([
    { name: 'frame01', maxCount: 1 },
    { name: 'frame02', maxCount: 1 },
    { name: 'frame03', maxCount: 1 },
    { name: 'frame04', maxCount: 1 },
    { name: 'frame05', maxCount: 1 },
    { name: 'frame06', maxCount: 1 }
]);

app.post('/api/upload-movie', async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({ error: err.message });
            }

            if (!req.files || Object.keys(req.files).length !== 6) {
                return res.status(400).json({ error: 'Exactly 6 frames are required' });
            }

            const movieTitle = req.body.movieTitle;
            if (!movieTitle) {
                return res.status(400).json({ error: 'Movie title is required' });
            }

            const dayNumber = req.dayNumber;
            const frames = [];
            
            // Sort frames in correct order
            
for (let i = 1; i <= 6; i++) {
    const frameField = `frame${String(i).padStart(2, '0')}`; // "frame01", "frame02"
    if (req.files[frameField] && req.files[frameField][0]) {
        frames.push(`/day${dayNumber}/${req.files[frameField][0].filename}`);
    } else {
        console.warn(`Warning: Missing frame ${frameField}`);
    }
}

            const newMovie = {
                title: movieTitle,
                frames: frames
            };

            const moviesData = await loadMoviesData();
            moviesData.push(newMovie);
            await saveMoviesData(moviesData);

            res.json({ message: 'Movie uploaded successfully', movie: newMovie });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get random movie endpoint
app.get('/api/next-movie', async (req, res) => {
    try {
        const movies = await loadMoviesData();
        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'No movies available' });
        }

        const randomIndex = Math.floor(Math.random() * movies.length);
        const movie = movies[randomIndex];
        
        const movieWithFullPaths = {
            title: movie.title,
            frames: movie.frames.map(frame => `http://localhost:3001/static${frame}`)
        };

        res.json(movieWithFullPaths);
    } catch (error) {
        console.error('Error serving next movie:', error);
        res.status(500).json({ error: 'Failed to get the next movie' });
    }
});


app.get('/api/suggest-movie', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const movies = await loadMoviesData();
        const suggestions = movies
            .map(movie => movie.title)
            .filter(title => title.toLowerCase().includes(query.toLowerCase()));

        res.json(suggestions);
    } catch (error) {
        console.error('Error in suggest-movie endpoint:', error);
        res.status(500).json({ error: 'Failed to fetch movie suggestions' });
    }
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'movies')));

// Initialize movies.json if it doesn't exist
async function initializeMoviesData() {
    const moviesFilePath = path.join(__dirname, 'movies.json');
    try {
        await fs.access(moviesFilePath);
    } catch (error) {
        await fs.writeFile(moviesFilePath, JSON.stringify({ movies: [] }, null, 2));
        console.log('Created initial movies.json file');
    }
}

// Start server
initializeMoviesData().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to initialize server:', error);
});



