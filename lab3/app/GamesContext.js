"use client";
import { createContext, useContext, useState, useEffect } from "react";

const GamesContext = createContext();

export function GamesProvider({ children }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("https://szandala.github.io/piwo-api/board-games.json")
      .then((res) => res.json())
      .then((data) => setGames(data.board_games || []))
      .catch((err) => console.error("Error fetching games:", err));
  }, []);

  function editGame(game) {
    setGames((old) => {
      const id = old.findIndex((g) => g.id === game.id);
      if (id !== -1) {
        const updated = [...old];
        updated[id] = game;
        return updated;
      } else {
        return [...old, game];
      }
    });
  }

  return (
    <GamesContext.Provider value={{ games, editGame }}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGamesContext() {
  return useContext(GamesContext);
}
