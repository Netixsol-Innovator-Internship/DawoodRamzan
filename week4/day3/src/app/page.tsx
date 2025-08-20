"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { GameCards } from "@/components/game-cards";
import { GamesOnSale } from "@/components/games-on-sale";
import { FreeGames } from "@/components/free-games";
import { TopGames } from "@/components/top-games";
import { Footer } from "@/components/footer";
import { Catalog } from "@/components/catalog";
import { useGameStore, mockGames } from "@/lib/store";

export default function HomePage() {
  const { setGames, setFeaturedGame } = useGameStore();

  useEffect(() => {
    // Initialize store with mock data
    setGames(mockGames);
    setFeaturedGame(mockGames[0]); // Set God of War as featured
  }, [setGames, setFeaturedGame]);

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <HeroSection />
      <GamesOnSale />

      <GameCards />
      <FreeGames />
      <TopGames />
      <GamesOnSale />

      <GameCards />
      <Catalog />
      <Footer />
    </div>
  );
}
