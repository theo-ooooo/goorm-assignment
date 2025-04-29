import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import { useDebounce } from "../../hooks/useDebounce";

function SearchPage() {
  const [searchMovies, setSearchMovies] = useState([]);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const searchTerm = useDebounce(useQuery().get("q"), 500);

  useEffect(() => {
    if (searchTerm) {
      console.log(searchTerm);
      fetchSearchMovie(searchTerm);
    }
  }, [searchTerm]);

  const fetchSearchMovie = async (searchTerm) => {
    try {
      const request = await axios.get(
        `/search/multi?include_adult=false&query=${searchTerm}`
      );
      setSearchMovies(request.data.results);
    } catch (e) {
      console.error("error", e);
    }
  };

  const renderSearchResults = () => {
    return searchMovies.length ? (
      <section className="search-container">
        {searchMovies.map((movie) => {
          if (movie.backdrop_path !== null && movie.media_type !== "person") {
            return (
              <div
                className="movie"
                key={movie.id}
                onClick={() => navigate(`/${movie.id}`)}
              >
                <div className="movie__column-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt="movie_poster"
                  />
                </div>
              </div>
            );
          }
        })}
      </section>
    ) : (
      <section className="no-results">
        <div className="no-results__text">
          <p>Your search for "{searchTerm}" did not have any matches.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Try different keywords</li>
          </ul>
        </div>
      </section>
    );
  };

  return renderSearchResults();
}

export default SearchPage;
