const moviePerPage = 20;
let currentPage = 1;
let totalPages = 1;
let searchQuery = "";

// Fetch and display movies for the current page and search query
async function fetchMovieList() {
  const offset = (currentPage - 1) * moviePerPage;
  let apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=482c09f3a4a9fe485dce706e8d645d2f&page=${currentPage}`; // added &page=${currentPage}

  // Modify API URL if there's a search query
  if (searchQuery) {
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=482c09f3a4a9fe485dce706e8d645d2f&query=${searchQuery.toLowerCase()}&page=${currentPage}`; //added pagination &page=${currentPage} for searchQuery, to show more than one page after searching
    // https://api.themoviedb.org/3/search/movie
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Movie not found");
    } // moved the if function fron the if searchQuery to outside the parent

    const data = await response.json(); //moved the if function fron the if searchQuery to outside the parent

    // Update the totalPages variable
    totalPages = data.total_pages;

    // Handle search results separately if a search query is present
    if (searchQuery) {
      // Show all movies matching the search query, NOT Show only single movie details for search
      // displaySingleMovie(data.results[0]); //data.results[0] shows first result from the search

      if (data.results.length === 0) {
        // No results found for the search query
        document.getElementById("movieGrid").innerHTML = `<p>Movie not found</p>`;
        document.getElementById("prevButton").disabled = true;
        document.getElementById("nextButton").disabled = true;
      } else {
        // Display matching search results
        displayMovieCards(data.results);
        updatePageInfo();
        updatePageButton();
      }

      updatePageInfo();
      updatePageButton();
    } else {
      // const data = await response.json();
      displayMovieCards(data.results);
      updatePageInfo();
      updatePageButton();
    }
  } catch (error) {
    document.getElementById("movieGrid").innerHTML = `<p>Movie not found</p>`;
    // document.getElementById("movieGrid").innerHTML = `<p>${error.message}</p>`;
    // throw new Error("Movie not found");
  }
}

// Display multiple Movie as cards in the grid
function displayMovieCards(movieList) { // added new name assigned for displayMovieCards function to represent the list of movies 
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
        <p>Rating: ${movie.vote_average.toFixed(1)} / 10</p>
      </a>
    `; // added a href, so movie card are clickable to the details page
    
    //.catch((error) =>
      //console.error("Error fetching Movie details:", error)
    //);

    gridContainer.appendChild(card);
  });
}

// Enable or disable buttons based on the current page
function updatePageButton() {
  if (currentPage === 1 && totalPages === 1) { // when movie search not found
    document.getElementById("prevButton").disabled = true;
    document.getElementById("nextButton").disabled = true;
  } else if (currentPage === 1) {
    document.getElementById("prevButton").disabled = true;
    document.getElementById("nextButton").disabled = false;
  } else if (currentPage === totalPages) {
    document.getElementById("prevButton").disabled = false;
    document.getElementById("nextButton").disabled = true;
  } else {
    document.getElementById("prevButton").disabled = false;
    document.getElementById("nextButton").disabled = false;
  }
}

// Handle page change
function changePage(direction) {
  currentPage += direction;
  fetchMovieList();
}

// Update the page info text
function updatePageInfo() {
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`; 

  // Enable or disable buttons based on the current page and search status
  // document.getElementById("prevButton").disabled = currentPage === 1;
  // document.getElementById("nextButton").disabled = searchQuery !== "";
}

// Search Movie by title
function searchMovie() {
  searchQuery = document.getElementById("searchInput").value.trim();
  currentPage = 1; // Reset to the first page of search results
  fetchMovieList();
}

// Initialize the app
fetchMovieList();
