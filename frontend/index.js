const movieFrame = document.getElementById("movie-frame");
const searchInput = document.getElementById("search-input");
const submitBtn = document.getElementById("submit-btn");
const gameOverDiv = document.getElementById("game-over");
const randomMovieBtn = document.getElementById("random-movie-btn");
const errorMessage = document.getElementById("error-message");
const suggestionsDiv = document.getElementById("suggestions");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let highlightedIndex = -1;
let currentMovie;
let currentFrame = 0;
let guessesRemaining = 6;
let gameWon = false;
let frameSeen = 6;

document.addEventListener('DOMContentLoaded', initGame);

async function fetchRandomMovie() {
  try {
    const response = await fetch("http://localhost:3001/api/next-movie");       
    if (!response.ok) {
      throw new Error("Failed to fetch movie data");
    }
    const movie = await response.json();
    console.log("Received movie data:", movie);
    return movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    errorMessage.textContent = "Failed to load movie. Please try again.";
    return null;
  }
}

function updateFrame() {
  if (!currentMovie || !currentMovie.frames) {
    console.error("No movie data available");
    return;
  }

  console.log("Loading frame:", currentMovie.frames[currentFrame]);
  movieFrame.src = currentMovie.frames[currentFrame];
  document.querySelector(".frame-counter").textContent = `${currentFrame + 1} / 6`;
  // Remove the decrement operator from here
  document.querySelector(".guesses").textContent = `${guessesRemaining} GUESSES REMAINING`;
  updateFrameNavigationButtons();
}

function handleGuess(guess) {
  if (!currentMovie) {
    console.error("No movie data available");
    return;
  }

  if (gameWon || guessesRemaining <= 0) return;

  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedTitle = currentMovie.title.toLowerCase();

  if (normalizedGuess === normalizedTitle) {
    gameWon = true;
    gameOverDiv.textContent = `Congratulations! You guessed it in ${6 - guessesRemaining} tries!`;
    gameOverDiv.className = "game-over success";
    gameOverDiv.style.display = "block";
    randomMovieBtn.style.display = "block";
    return;
  }

  guessesRemaining--;
  // Update the guesses display after decrementing
  document.querySelector(".guesses").textContent = `${guessesRemaining} GUESSES REMAINING`;

  if (guessesRemaining === 0) {
    gameOverDiv.textContent = `Game Over! The movie was ${currentMovie.title}`;
    gameOverDiv.className = "game-over failure";
    gameOverDiv.style.display = "block";
    randomMovieBtn.style.display = "block";
    return;
  }

  // Automatically advance to next frame after incorrect guess
  if (currentFrame < 5) {
    currentFrame++;
    updateFrame();
  }
}

function updateFrameNavigationButtons() {
  prevBtn.disabled = currentFrame === 0;
  nextBtn.disabled = currentFrame === 5;
}

// Modified frame navigation to not affect game state
prevBtn.addEventListener("click", () => {
  if (currentFrame > 0) {
    currentFrame--;
    guessesRemaining++;
    updateFrame();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentFrame < 5) {
    currentFrame++;
    guessesRemaining--;
    updateFrame();
  }
});

async function initGame() {
  currentFrame = 0;
  guessesRemaining = 6;
  gameWon = false;
  gameOverDiv.style.display = "none";
  randomMovieBtn.style.display = "none";
  errorMessage.textContent = "";
  searchInput.value = "";
  suggestionsDiv.style.display = "none";

  currentMovie = await fetchRandomMovie();
  if (currentMovie) {
    updateFrame();
  }
}

// Rest of the code remains the same...
async function fetchSuggestions(query) {
  try {
    const response = await fetch(`http://localhost:3001/api/suggest-movie?q=${query}`);
    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }
    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

function showSuggestions(suggestions) {
  suggestionsDiv.innerHTML = "";

  if (suggestions.length === 0) {
    suggestionsDiv.style.display = "none";
    return;
  }

  suggestionsDiv.style.display = "block";

  suggestions.forEach((suggestion, index) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.textContent = suggestion;

    suggestionItem.addEventListener("mouseenter", () => {
      highlightedIndex = index;
      updateHighlightedSuggestion();
    });

    suggestionItem.addEventListener("click", () => {
      searchInput.value = suggestion;
      suggestionsDiv.style.display = "none";
    });

    suggestionsDiv.appendChild(suggestionItem);
  });
}

function updateHighlightedSuggestion() {
  const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion-item");
  suggestionItems.forEach((item, index) => {
    if (index === highlightedIndex) {
      item.style.backgroundColor = "#233034";
    } else {
      item.style.backgroundColor = "";
    }
  });
}

searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (query.length === 0) {
    suggestionsDiv.style.display = "none";
    return;
  }

  const suggestions = await fetchSuggestions(query);
  showSuggestions(suggestions);
});

searchInput.addEventListener("keydown", (e) => {
  const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion-item");

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (highlightedIndex < suggestionItems.length - 1) {
      highlightedIndex++;
      updateHighlightedSuggestion();
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (highlightedIndex > 0) {
      highlightedIndex--;
      updateHighlightedSuggestion();
    }
  } else if (e.key === "Enter") {
    if (highlightedIndex !== -1 && suggestionsDiv.style.display !== "none") {
      searchInput.value = suggestionItems[highlightedIndex].textContent;
      suggestionsDiv.style.display = "none";
      highlightedIndex = -1;
    } else {
      handleGuess(searchInput.value);
      searchInput.value = "";
    }
  }
});

// Simplified submit handlers
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && suggestionsDiv.style.display === "none") {
    handleGuess(searchInput.value);
    searchInput.value = "";
  }
});

submitBtn.addEventListener("click", () => {
  handleGuess(searchInput.value);
  searchInput.value = "";
});

randomMovieBtn.addEventListener("click", initGame);

// Start the game
initGame();