
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");




// ---------------- INDEX PAGE ----------------

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const movieName = searchInput.value.trim();

        if (movieName === "") {

            alert("Enter Movie Name");

            return;
        }

    //    input box empty
        searchInput.value = "";

    //    movie page navigation
        window.location.href =
            `movie.html?movie=${encodeURIComponent(movieName)}`;

    });

}


if (searchInput) {

    searchInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            searchBtn.click();

        }

    });

}



// ---------------- MOVIE PAGE ----------------



const movieDetails =
document.getElementById("movieDetails");


if(movieDetails){

    const params =
    new URLSearchParams(window.location.search);

    const movieName =
    params.get("movie");

    getMovie(movieName);

}


async function getMovie(name) {

    const response = await fetch(
        `https://www.omdbapi.com/?apikey=61e576a4&t=${encodeURIComponent(name)}&plot=full`
    );

    const movie = await response.json();

    if (movie.Response === "False") {

        document.getElementById("movieDetails").innerHTML = `
            <h1>Movie Not Found</h1>
        `;

        return;
    }

    window.currentMovie = movie;

    showMovie(movie);

}

function showMovie(movie){

    const container =
    document.getElementById("movieDetails");


    container.innerHTML = `

    <div class="details-card">

        <div class="poster-section">

            <img
                src="${movie.Poster}"
                class="movie-poster"
            >

        </div>


        <div class="movie-info">

            <h1>${movie.Title}</h1>

            <button
                class="fav-btn"
                onclick="addToFavorites()"
            >
                Add To Favorites
            </button>

            <p class="year">

                ${movie.Year}
                •
                ${movie.Rated}
                •
                ${movie.Runtime}

            </p>


            <p>

                <b>Genre:</b>

                ${movie.Genre}

            </p>

            <p>

                <b>Released:</b>

                ${movie.Released}

            </p>

            <p>

                <b>Director:</b>

                ${movie.Director}

            </p>

            <p>

                <b>Writer:</b>

                ${movie.Writer}

            </p>

            <p>

                <b>Actors:</b>

                ${movie.Actors}

            </p>


            <h2>

                Plot

            </h2>

            <p>

                ${movie.Plot}

            </p>


            <h2>

                Ratings

            </h2>


            <div class="ratings">

                ${
                    movie.Ratings
                    ? movie.Ratings.map(r => `
                        <span>
                            ${r.Source}: ${r.Value}
                        </span>
                    `).join("")
                    : "<span>No Ratings Available</span>"
                }

            </div>


            <div class="extra-info">

                <div>

                    <p>

                        <b>Language:</b>

                        ${movie.Language}

                    </p>

                    <p>

                        <b>Box Office:</b>

                        ${movie.BoxOffice}

                    </p>

                </div>


                <div>

                    <p>

                        <b>Country:</b>

                        ${movie.Country}

                    </p>

                    <p>

                        <b>Production:</b>

                        ${movie.Production || "N/A"}

                    </p>

                </div>


                <div>

                    <p>

                        <b>Awards:</b>

                        ${movie.Awards}

                    </p>

                    <p>

                        <b>Type:</b>

                        ${movie.Type.toUpperCase()}

                    </p>

                </div>

            </div>


        </div>

    </div>

    `;

}





window.addEventListener("load", () => {

    const intro = document.getElementById("intro-screen");
    const sound = document.getElementById("introSound");

    // First visit in this tab
    if (!sessionStorage.getItem("introPlayed")) {

        // Wait for user click anywhere on intro
        intro.addEventListener("click", () => {

            sessionStorage.setItem("introPlayed", "true");

            // Play sound
            sound.volume = 0.7;

            sound.play().catch(error => {
                console.log("Audio Error:", error);
            });

            // Remove intro after animation completes
            setTimeout(() => {

                if (intro) {
                    intro.remove();
                }

            }, 3500);

        }, { once: true });

    }

    // Already played, skip intro
    else {

        if (intro) {
            intro.style.display = "none";
        }

    }

});





// add to favorite


function addToFavorites(){

    let favorites =

    JSON.parse(

        localStorage.getItem("favorites")

    ) || [];


    const movie = window.currentMovie;


    const exists = favorites.find(

        item => item.imdbID === movie.imdbID

    );


    if(exists){

        alert("Already Added ❤️");

        return;

    }


    favorites.push(movie);


    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );


    alert("Added To Favorites ❤️");

}

//Open Favorites Page

const favoritesBtn =

document.getElementById("favoritesBtn");


if(favoritesBtn){

    favoritesBtn.addEventListener(

        "click",

        ()=>{

            window.location.href =

            "favorites.html";

        }

    );

}


//Display Favorite Movies
const favoritesContainer =

document.getElementById(

    "favoritesContainer"
);


if(favoritesContainer){

    showFavorites();

}


function showFavorites() {


const favoritesContainer =
document.getElementById("favoritesContainer");

const favorites =
JSON.parse(
    localStorage.getItem("favorites")
) || [];


if (favorites.length === 0) {

    favoritesContainer.innerHTML =
    "<h2>No Favorite Movies Yet </h2>";

    return;

}


favoritesContainer.innerHTML =

favorites.map(movie => `

    <div class="movie-card">

        <img
            src="${movie.Poster}"
            alt="${movie.Title}"
        >

        <h3>${movie.Title}</h3>

        <p>${movie.Year}</p>

        <button
            class="remove-btn"
            onclick="removeFavorite('${movie.imdbID}')"
        >
            Remove ❌
        </button>

    </div>

`).join("");


}



function removeFavorite(id){


let favorites =

JSON.parse(

    localStorage.getItem("favorites")

) || [];


favorites = favorites.filter(

    movie => movie.imdbID !== id

);


localStorage.setItem(

    "favorites",

    JSON.stringify(favorites)

);


showFavorites();


}
