const movieId = new URLSearchParams(window.location.search).get("movieId");

let genreList = {}; // To store the mapping of genre IDs to names

// Fetch genre list and store it
async function fetchGenreList() {
  const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=482c09f3a4a9fe485dce706e8d645d2f`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch genre list");
    }

    const data = await response.json();
    genreList = data.genres.reduce((acc, genre) => { 
      acc[genre.id] = genre.name; // Map genre ID to genre name
      return acc;
    }, {});
    // data.genre takes data from API, with two properties of id and name
    // reduce transform the data.genres array into a single object (genreList), acc (accumulator)
    // reduce: it goes through all the cards one by one and builds the map; think of acc like a big basket where we’re dropping things. (cavemen language lesgooo)
    // this is building a fast lookup map for the genrelist that has movieId connected to its name
  } catch (error) {
    console.error("Error fetching genre list:", error);
  }
}


// Fetch and display movies details
async function fetchMovieDetails() {
  let apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=482c09f3a4a9fe485dce706e8d645d2f`;
  //const genres = movieDetails.genres.map((genre) => genre.name).join(", ");

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();

    // Map genre IDs to names
    const genres = data.genres
      .map((genre) => genreList[genre.id] || "Unknown")
      .join(", ");
    //  turning genre IDs into their names and making a nice list to show

    document.getElementById("movieTitle").textContent = data.title;
    document.getElementById("moviePoster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    document.getElementById("movieOverview").textContent = data.overview;
    document.getElementById("releaseDate").textContent = data.release_date;
    document.getElementById("rating").textContent = data.vote_average.toFixed(1) + ' / 10'; 
    // rating rounded to 1 decimal point
    document.getElementById("genres").textContent = genres; // Update genre display
  } catch (error) {
    console.error("Error:", error);
    document.body.innerHTML = `<p>Failed to load movie details.</p>`;
  }
}

// Fetch and display movie credits (cast and crew)
async function fetchMovieCredits() {
  let apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=482c09f3a4a9fe485dce706e8d645d2f`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch movie credits");
    }

    const data = await response.json();

    // Display cast
    const cast = data.cast.slice(0, 5); // Show top 5 cast members
    const castList = document.getElementById("cast");
    cast.forEach((actor) => {
      const castItem = document.createElement("div");
      castItem.classList.add("cast-member");
      castItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="Profile Image of ${actor.name}">
        <p>${actor.name} as ${actor.character}</p>
      `;
      castList.appendChild(castItem);
    });

    // Display crew (e.g., director)
    const crew = data.crew.filter((member) => member.job === "Director" || "Producer").slice(0, 5); // || is or in javascript
    const crewList = document.getElementById("crew");
    crew.forEach((member) => {
      const crewItem = document.createElement("div");
      crewItem.classList.add("crew-member");
      crewItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${member.profile_path}" alt="Profile Image of ${member.name}">
        <p>${member.name} - ${member.job}</p>
      `;
      crewList.appendChild(crewItem);
    });

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("movieCredits").innerHTML = `<p>Failed to load movie credits.</p>`;
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
        <p>Rating: ${movie.vote_average.toFixed(1)}  / 10 </p>
      </a>
    `; // added a href, so movie card are clickable to the details page

    gridContainer.appendChild(card);
  });
}

// Initialize the app
fetchGenreList(); // Fetch genre list first
fetchMovieDetails();
fetchMovieCredits()
fetchMovieList();