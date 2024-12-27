const movieFrame = document.getElementById("movie-frame");
const searchInput = document.getElementById("search-input");
const submitBtn = document.getElementById("submit-btn");
const gameOverDiv = document.getElementById("game-over");
const randomMovieBtn = document.getElementById("random-movie-btn");
const errorMessage = document.getElementById("error-message");
const suggestionsDiv = document.getElementById("suggestions");
let highlightedIndex = -1;

let currentMovie;
let currentFrame = 0;
let guessesRemaining = 6;
let gameWon = false;

      async function fetchRandomMovie() {
        try {
          const response = await fetch("http://localhost:3000/api/next-movie");
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
        document.querySelector(".frame-counter").textContent = `${
          currentFrame + 1
        } / 6`;
        document.querySelector(
          ".guesses"
        ).textContent = `${guessesRemaining} GUESSES REMAINING`;
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
          gameOverDiv.textContent = `Congratulations! You guessed it in ${
            6 - guessesRemaining
          } tries!`;
          gameOverDiv.className = "game-over success";
          gameOverDiv.style.display = "block";
          randomMovieBtn.style.display = "block";
          return;
        }

        guessesRemaining--;

        if (guessesRemaining === 0) {
          gameOverDiv.textContent = `Game Over! The movie was ${currentMovie.title}`;
          gameOverDiv.className = "game-over failure";
          gameOverDiv.style.display = "block";
          randomMovieBtn.style.display = "block";
          return;
        }

        currentFrame = Math.min(currentFrame + 1, 5);
        updateFrame();
      }

      async function initGame() {
        currentFrame = 0;
        guessesRemaining = 6;
        gameWon = false;
        gameOverDiv.style.display = "none";
        randomMovieBtn.style.display = "none";
        errorMessage.textContent = "";
        searchInput.value = "";

        currentMovie = await fetchRandomMovie();
        if (currentMovie) {
          updateFrame();
        }
      }

      async function fetchSuggestions(query) {
        try {
          const response = await fetch(`http://localhost:3000/api/suggest-movie?q=${query}`);
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
        // Clear previous suggestions
        suggestionsDiv.innerHTML = "";
      
        // If no suggestions, hide the dropdown
        if (suggestions.length === 0) {
          suggestionsDiv.style.display = "none";
          return;
        }
      
        // Show suggestions dropdown
        suggestionsDiv.style.display = "block";
      
        // Add each suggestion to the dropdown
        suggestions.forEach((suggestion) => {
          const suggestionItem = document.createElement("div");
          suggestionItem.className = "suggestion-item";
          suggestionItem.textContent = suggestion;

          // Add keyboard navigation and hover effect
    suggestionItem.addEventListener("mouseenter", () => {
      highlightedIndex = index;
      updateHighlightedSuggestion();
    });
        
          
          // Handle click on a suggestion
          suggestionItem.addEventListener("click", () => {
            searchInput.value = suggestion; // Populate input with the selected suggestion
            suggestionsDiv.style.display = "none"; // Hide suggestions
          });
      
          suggestionsDiv.appendChild(suggestionItem);
        });
      }

      
function updateHighlightedSuggestion() {
  const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion-item");

  suggestionItems.forEach((item, index) => {
    if (index === highlightedIndex) {
      item.style.backgroundColor = "#233034"; // Highlighted color
    } else {
      item.style.backgroundColor = ""; // Reset other items
    }
  });
}

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleGuess(searchInput.value);
          searchInput.value = "";
        }
      });

      submitBtn.addEventListener("click", () => {
        handleGuess(searchInput.value);
        searchInput.value = "";
      });

      randomMovieBtn.addEventListener("click", initGame);

      searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();
        if (query.length === 0) {
          suggestionsDiv.style.display = "none"; // Hide suggestions if input is empty
          return;
        }
      
        const suggestions = await fetchSuggestions(query);
        showSuggestions(suggestions);
      });

      searchInput.addEventListener("keydown", (e) => {
        const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion-item");
      
        if (e.key === "ArrowDown") {
          if (highlightedIndex < suggestionItems.length - 1) {
            highlightedIndex++;
            updateHighlightedSuggestion();
          }
        } else if (e.key === "ArrowUp") {
          if (highlightedIndex > 0) {
            highlightedIndex--;
            updateHighlightedSuggestion();
          }
        } else if (e.key === "Enter" && highlightedIndex !== -1) {
          searchInput.value = suggestionItems[highlightedIndex].textContent;
          suggestionsDiv.style.display = "none"; // Hide suggestions after selection
          highlightedIndex = -1; // Reset highlighted index
        }
      });

      // Add error handling for image loading
      // movieFrame.addEventListener('error', () => {
      //     console.error('Failed to load image:', movieFrame.src);
      //     errorMessage.textContent = 'Failed to load image. Please try again.';
      // });

      // Start the game
      initGame();