"use client";
import Link from "next/link";
import Image from "next/image";
import { useGamesContext } from "../../GamesContext";

export default function GameDetail({ params }) {
  const gameId = params.id;
  const {games} = useGamesContext();

  const game = games.find((g) => g.id.toString() === gameId) || null;

  if (!game) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>Ładowanie...</p>
    );
  }

  return (
    <main className="game-detail-page">
      <button className="back-btn">
        <Link href="/">Powrót</Link>
      </button>

      <section className="game-detail-content">
        <section className="game-detail-gallery">
          {game.images && game.images.map((img, index) => (
            <Image key={index} src={`/next.svg`} alt={game.title} width={500} height={500} />
          ))}
        </section>

        <section className="game-detail-purchase-info">
          <h1>{game.title}</h1>
          <p><b>{game.publisher}</b></p>

          <div className="game-detail-price">
            <p>Cena:</p>
            <p className="price">{game.price_pln} zł</p>
          </div>

          {game.auction && (
            <section className="game-detail-auction">
              <h3>LICYTACJA</h3>
              <p>Aktualna oferta: <b>{game.auction.current_bid} zł</b></p>
              <p>Cena wywoławcza: {game.auction.starting_price} zł</p>
              <p>Licytujący: {game.auction.highest_bidder_uid}</p>
            </section>
          )}
        </section>
      </section>

      <section className="game-detail-parameters">
        <h3>Parametry</h3>
        <ul>
          <li><b>Typ:</b> {game.type}</li>
          <li><b>Liczba graczy:</b> {game.min_players} - {game.max_players}</li>
          <li><b>Czas gry:</b> {game.avg_play_time_minutes} min</li>
          <li><b>Dodatek:</b> {game.is_expansion ? "Tak" : "Nie"}</li>
        </ul>
      </section>

      <section className="game-detail-description">
        <h3>Opis</h3>
        {game.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

    </main>
  );
}