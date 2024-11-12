const pokemonPerPage = 20;
let currentPage = 1;
let searchQuery = "";

// Fetch and display movies for the current page and search query
async function fetchPokemonList() {
  const offset = (currentPage - 1) * pokemonPerPage;
  let apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=482c09f3a4a9fe485dce706e8d645d2f&page=${currentPage}`; // added &page=${currentPage}

  // Modify API URL if there's a search query
  if (searchQuery) {
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=482c09f3a4a9fe485dce706e8d645d2f&query=${searchQuery.toLowerCase()}`;
    // https://api.themoviedb.org/3/search/movie
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Movie not found");
    } // moved the if function fron the if searchQuery to outside the parent

    const data = await response.json(); //moved the if function fron the if searchQuery to outside the parent

    // Handle search results separately if a search query is present
    if (searchQuery) {
      // Show only single movie details for search
      displaySinglePokemon(data.results[0]); // added .results[0]
    } else {
      // const data = await response.json();
      displayPokemonCards(data.results);
      updatePageInfo();
    }
  } catch (error) {
    document.getElementById(
      "pokemonGrid"
    ).innerHTML = `<p>${error.message}</p>`;
  }
}

// Display multiple Pokémon as cards in the grid
function displayPokemonCards(movieList) { // added new name assigned for displayPokemonCards function to represent the list of movies 
  const gridContainer = document.getElementById("pokemonGrid");
  gridContainer.innerHTML = ""; // Clear the grid

  movieList.forEach((movie) => { // movie as a temporary name
    const card = document.createElement("div");
    card.className = "pokemon-card";

    // Fetch and display individual Pokémon details
    //fetch(pokemon.url)
      //.then((response) => response.json())
      //.then((data) => { no need
    card.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"> 
      <p>Popularity: ${movie.popularity}</p>
    `; //lala
    
    //.catch((error) =>
      //console.error("Error fetching Movie details:", error)
    //);

    gridContainer.appendChild(card);
  });
}
//);
//}

// Display a single movie when searched by title
function displaySinglePokemon(movie) {
  const gridContainer = document.getElementById("pokemonGrid");
  gridContainer.innerHTML = ""; // Clear the grid

  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <h3>${movie.title}</h3>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <p>Popularity: ${movie.popularity}</p>
    <p> Overview: ${movie.overview}</p> 
  `; // type.type.title
    // pokemon.types.map((type) => popularity)
    // pokemon.poster_path

  gridContainer.appendChild(card);

  // Disable pagination buttons since we're only showing a single Pokémon
  document.getElementById("prevButton").disabled = true;
  document.getElementById("nextButton").disabled = true;
  document.getElementById("pageInfo").textContent = "Search Result";
}

// Handle page change
function changePage(direction) {
  currentPage += direction;
  fetchPokemonList();
}

// Update the page info text
function updatePageInfo() {
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.textContent = `Page ${currentPage}`;

  // Enable or disable buttons based on the current page and search status
  document.getElementById("prevButton").disabled = currentPage === 1;
  document.getElementById("nextButton").disabled = searchQuery !== "";
}

// Search Pokémon by title
function searchPokemon() {
  searchQuery = document.getElementById("searchInput").value.trim();
  currentPage = 1; // Reset to the first page of search results
  fetchPokemonList();
}

// Initialize the app
fetchPokemonList();
