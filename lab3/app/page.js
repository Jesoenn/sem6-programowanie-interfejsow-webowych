"use client";
import { useState } from "react";
import Link from "next/link";
import { useGamesContext } from "./GamesContext";

function filterGames(games, searchDesc, genre, maxPrice, players, publisher, maxDuration) {
  return games.filter((game) => {
    const descText = Array.isArray(game.description) ? game.description.join(" "): (game.description || "");
    const matchDesc = game.title.toLowerCase().includes(searchDesc.toLowerCase()) || descText.toLowerCase().includes(searchDesc.toLowerCase());
    const matchGenre = genre === "Wszystkie" || game.type === genre;
    const matchPrice = !maxPrice || (game.price_pln !== undefined && Number(game.price_pln) <= Number(maxPrice));

    let matchPlayers = true;
    if (players) {
      matchPlayers = (game.min_players !== undefined && game.max_players !== undefined && Number(players) >= Number(game.min_players) && Number(players) <= Number(game.max_players));
    }
    const matchPublisher = !publisher || (game.publisher && game.publisher.toLowerCase().includes(publisher.toLowerCase()));
    const matchDuration = !maxDuration || (game.avg_play_time_minutes !== undefined && Number(game.avg_play_time_minutes) <= Number(maxDuration));
    return matchDesc && matchGenre && matchPrice && matchPlayers && matchPublisher && matchDuration;
  });
}

function getUniqueGenres(games) {
  let genres = [];
  games.forEach(game => {
    const genre = game.type;
    if (genre && genres.indexOf(genre) === -1) {
      genres.push(genre);
    }
  });

  return genres;
}

export default function Home() {
  const {games} = useGamesContext();
  const [searchDesc, setDesc] = useState("");
  const [genre, setGenre] = useState("Wszystkie");
  const [maxPrice, setMaxPrice] = useState("");
  const [players, setPlayers] = useState("");
  const [publisher, setPublisher] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  const handleFilterChange = (setter, value) => {
    setter(value);    
    setCurrentPage(1); 
  };

  const filteredGames = filterGames(games, searchDesc, genre, maxPrice, players, publisher, maxDuration);
  const genres = getUniqueGenres(games);

  const totalPages = Math.ceil(filteredGames.length/gamesPerPage);
  const indexOfLastGame = currentPage*gamesPerPage;
  const indexOfFirstGame = indexOfLastGame-gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <main>
      <section className="filter-card">
        <label htmlFor="game-desc">Opis:</label>
        <input type="text" id="game-desc" className="filter-input" placeholder="Czego szukasz?" value={searchDesc} 
          onChange={(e) => handleFilterChange(setDesc, e.target.value)}
        />

        <label htmlFor="game-genre">Gatunek: </label>
        <select id="game-genre" className="filter-input" value={genre} 
          onChange={(e) => handleFilterChange(setGenre, e.target.value)}>
          <option value="Wszystkie">Wszystkie</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <label htmlFor="game-price">Cena maksymalna:</label>
        <input type="number" id="game-price" className="filter-input" min="0" value={maxPrice} 
          onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
        />

        <label htmlFor="game-players">Ilość graczy:</label>
        <input type="number" id="game-players" className="filter-input" min="1" value={players} 
          onChange={(e) => handleFilterChange(setPlayers, e.target.value)}
        />

        <label htmlFor="game-publisher">Wydawnictwo:</label>
        <input type="text" id="game-publisher" className="filter-input" value={publisher} 
          onChange={(e) => handleFilterChange(setPublisher, e.target.value)}
        />

        <label htmlFor="game-duration">Czas gry (max):</label>
        <input type="number" id="game-duration" className="filter-input" min="0" value={maxDuration}
          onChange={(e) => handleFilterChange(setMaxDuration, e.target.value)}
        />

        <Link href="/game/edit/-1">
          <button className="cart-btn">Stwórz nową pozycję</button>
        </Link>

      </section>

      <section className="game-list">
          <h2>Lista gier</h2>
          <ul>
            {currentGames.map((game) => (
              <li key={game.id}>
                <Link href={`/game/${game.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3>{game.title}</h3>
                  <p><b>Gatunek:</b> {game.type}</p>
                  <p><b>Ilość graczy:</b> {game.min_players} - {game.max_players}</p>
                  <p><b>Czas gry:</b> {game.avg_play_time_minutes} min</p>
                  <p><b>Cena:</b> {game.price_pln} zł</p>
                </Link>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <Link href={`/game/edit/${game.id}`}>
                    <button className="cart-btn">Edytuj</button>
                  </Link>
                  <button className="cart-btn" onClick={(e) => e.preventDefault()}>Dodaj do koszyka</button>
                </div>
              </li>
            ))}
          </ul>
      </section>

      {totalPages > 1 && (
        <section className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="page-btn">
            Poprzednia
          </button>
        
          <p className="page-info"> Strona <strong>{currentPage}</strong> z {totalPages} </p>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="page-btn">
            Następna
          </button>
        </section>
      )}
    </main>
  );
}
