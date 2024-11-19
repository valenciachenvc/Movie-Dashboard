const movieId = new URLSearchParams(window.location.search).get("movieId");

// Fetch and display movies for the current page and search query
async function fetchMovieDetails() {
  let apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=482c09f3a4a9fe485dce706e8d645d2f`;
  //const genres = movieDetails.genres.map((genre) => genre.name).join(", ");

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();

    document.getElementById("movieTitle").textContent = data.title;
    document.getElementById("moviePoster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById("movieOverview").textContent = data.overview;
    document.getElementById("releaseDate").textContent = data.release_date;
    document.getElementById("rating").textContent = data.vote_average + " / 10";
    //document.getElementById("genres").textContent = data.genres;
  } catch (error) {
    console.error("Error:", error);
    document.body.innerHTML = `<p>Failed to load movie details.</p>`;
  }
}

let currentPage = 1;
// Fetch and display recommended movies for the current movie
async function fetchMovieList() {
    let apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=482c09f3a4a9fe485dce706e8d645d2f&page=${currentPage}`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error("Movie not found");
      } // moved the if function fron the if searchQuery to outside the parent
  
      const data = await response.json(); //moved the if function fron the if searchQuery to outside the parent
  
    
    displayMovieCards(data.results);
    // updatePageInfo(); lol this is not supposed to be here loll this has been the error the whole time
    // updatePageButton(); RAHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

    } catch (error) {
      document.getElementById("movieGrid").innerHTML = `<p>Movie not found</p>`;
    }
}

// Display multiple reccomended movies as cards in the grid
function displayMovieCards(movieList) { 
  const gridContainer = document.getElementById("movieGrid");
  gridContainer.innerHTML = ""; // Clear the grid

  movieList.forEach((movie) => { // movie as a temporary name
    const card = document.createElement("div");
    card.className = "movie-card";

    // Fetch and display individual Movie details
    //fetch(movie.url)
      //.then((response) => response.json())
      //.then((data) => { no need
    card.innerHTML = `
      <a href = "details.html?movieId=${movie.id}" class = "movie-link"> 
        <h3>${movie.title}</h3>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"> 
        <p>Rating: ${movie.vote_average}  / 10 </p>
      </a>
    `; // added a href, so movie card are clickable to the details page

    gridContainer.appendChild(card);
  });
}

// Initialize the app
fetchMovieDetails();
fetchMovieList();