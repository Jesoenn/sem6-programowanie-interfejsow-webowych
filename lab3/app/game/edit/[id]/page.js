"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGamesContext } from "../../../GamesContext";

function getMaxId(games) {
  if (!games || games.length === 0) {
    return 1;
  }
  let max = games[0].id;
  for (let i = 1; i < games.length; i++) {
    if (games[i].id > max) {
      max = games[i].id;
    }
  }
  return max + 1;
}


export default function GameEdit() {
  const id = useParams().id; 
  const router = useRouter();
  const { games, editGame } = useGamesContext();

  const editing = id ? games.find((g) => g.id.toString() === id) : null;

  const [form, setForm] = useState(() => ({
    title: editing?.title || "",
    description: editing?.description?.join("\n") || "",
    type: editing?.type || "",
    min_players: editing?.min_players || 1,
    max_players: editing?.max_players || 1,
    publisher: editing?.publisher || "",
    avg_play_time_minutes: editing?.avg_play_time_minutes || 0,
    price_pln: editing?.price_pln || 0,
    is_expansion: editing?.is_expansion || false,
  }));

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    let newId = editing?.id;
    if (!editing) {
      newId = getMaxId(games);
    }
    const updatedGame = {
      ...editing, 
      ...form,
      description: form.description.split("\n"),
      id: newId, 
    };

    editGame(updatedGame);
    router.push("/");
  }

  return (
    <main className="newgame-card">
      <h2>{editing ? `Edycja: ${editing.title}` : "Wprowadź nową pozycję"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Nazwa gry:</label>
        <input name="title" id="title" value={form.title} onChange={handleChange} className="filter-input" required />

        <label htmlFor="description">Opis:</label>
        <textarea name="description" id="description" value={form.description} onChange={handleChange} className="filter-input" required />

        <label htmlFor="type">Gatunek:</label>
        <select name="type" id="type" value={form.type} onChange={handleChange} className="filter-input">
          <option value="">Wszystkie</option>
          <option value="Strategiczne">Strategiczne</option>
          <option value="Przygodowe">Przygodowe</option>
          <option value="Imprezowe">Imprezowe</option>
          <option value="Logiczne">Logiczne</option>
        </select>

        <label htmlFor="min_players">Min. liczba graczy:</label>
        <input type="number" name="min_players" id="min_players" min="1" value={form.min_players} onChange={handleChange} className="filter-input" required />

        <label htmlFor="max_players">Maks. liczba graczy:</label>
        <input type="number" name="max_players" id="max_players" min={form.min_players} value={form.max_players} onChange={handleChange} className="filter-input" required />

        <label htmlFor="publisher">Wydawnictwo:</label>
        <input name="publisher" id="publisher" value={form.publisher} onChange={handleChange} className="filter-input" required />

        <label htmlFor="avg_play_time_minutes">Czas gry (min):</label>
        <input type="number" name="avg_play_time_minutes" id="avg_play_time_minutes" min="0" value={form.avg_play_time_minutes} onChange={handleChange} className="filter-input" required />

        <label htmlFor="price_pln">Cena (zł):</label>
        <input type="number" name="price_pln" id="price_pln" min="0" step="0.01" value={form.price_pln} onChange={handleChange} className="filter-input" required />

        <label htmlFor="is_expansion" style={{ display: "flex", alignItems: "center", gap: "0.5rem"}}>
          <input type="checkbox" name="is_expansion" id="is_expansion" checked={form.is_expansion} onChange={handleChange}/> Dodatek
        </label>

        <button className="newgame-btn" type="submit">
          {editing ? "Zapisz zmiany" : "Utwórz pozycję"}
        </button>
      </form>
    </main>
  );
}