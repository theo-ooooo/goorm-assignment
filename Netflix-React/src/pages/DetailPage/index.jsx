import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailPage() {
  const { movieId } = useParams();
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    fetchData();
  }, [movieId]);

  const fetchData = async () => {
    const request = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`
    );
    setMovies(request.data);
  };

  if (!movies) return null;
  return (
    <section>
      <img
        src={`https://image.tmdb.org/t/p/original/${movies.backdrop_path}`}
        alt="modal__poster-img"
        className="modal__poster-img"
      />
    </section>
  );
}

export default DetailPage;
