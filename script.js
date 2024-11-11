const pokemonPerPage = 20;
let currentPage = 1;
let searchQuery = "";

// Fetch and display Pokémon for the current page and search query
async function fetchPokemonList() {
  const offset = (currentPage - 1) * pokemonPerPage;
  let apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;

  // Modify API URL if there's a search query
  if (searchQuery) {
    apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`;
  }

  try {
    const response = await fetch(apiUrl);

    // Handle search results separately if a search query is present
    if (searchQuery) {
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
      const data = await response.json();
      displaySinglePokemon(data);
    } else {
      const data = await response.json();
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
function displayPokemonCards(pokemonList) {
  const gridContainer = document.getElementById("pokemonGrid");
  gridContainer.innerHTML = ""; // Clear the grid

  pokemonList.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    // Fetch and display individual Pokémon details
    fetch(pokemon.url)
      .then((response) => response.json())
      .then((data) => {
        card.innerHTML = `
                    <h3>${
                      data.name.charAt(0).toUpperCase() + data.name.slice(1)
                    }</h3>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p>Type: ${data.types
                      .map((type) => type.type.name)
                      .join(", ")}</p>
                `;
      })
      .catch((error) =>
        console.error("Error fetching Pokémon details:", error)
      );

    gridContainer.appendChild(card);
  });
}

// Display a single Pokémon when searched by name
function displaySinglePokemon(pokemon) {
  const gridContainer = document.getElementById("pokemonGrid");
  gridContainer.innerHTML = ""; // Clear the grid

  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Type: ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
    `;

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

// Search Pokémon by name
function searchPokemon() {
  searchQuery = document.getElementById("searchInput").value.trim();
  currentPage = 1; // Reset to the first page of search results
  fetchPokemonList();
}

// Initialize the app
fetchPokemonList();
