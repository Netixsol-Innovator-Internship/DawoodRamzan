"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const topSellers = [
  {
    id: "1",
    title: "Ghostbusters: Spirits Unleashed",
    price: "₹939",
    image: "/Warface.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier Edition",
    price: "₹2,499",
    image: "/gta.jpg",
  },
  {
    id: "3",
    title: "Daysgone",
    price: "₹2,699",
    image: "/daysGone.jpg",
  },
  {
    id: "4",
    title: "Last of Us",
    price: "₹1,499",
    image: "/lastofUs.jpg",
  },
  {
    id: "5",
    title: "God of War 4",
    price: "₹2,659",
    image: "/god.jpg",
  },
];

const bestSellers = [
  {
    id: "1",
    title: "Fortnite",
    price: "Free",
    image: "/fort.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier edition",
    price: "₹2,499",
    image: "/gta.jpg",
  },
  {
    id: "3",
    title: "IGI 2",
    price: "₹499",
    image: "/igi.jpg",
  },
  {
    id: "4",
    title: "Tomb Raider",
    price: "₹2,499",
    image: "/tombRaider.jpg",
  },
  {
    id: "5",
    title: "Uncharted 4",
    price: "₹3,499",
    image: "/Uncharted.jpg",
  },
];

const upcomingGames = [
  {
    id: "1",
    title: "Hogwarts Legacy",
    price: "₹2,999",
    image: "/hog.jpg",
  },
  {
    id: "2",
    title: "Uncharted Legacy of Thieves",
    price: "₹4,499",
    image: "/chart.jpg",
  },
  {
    id: "3",
    title: "Assassin's Creed Mirage",
    price: "₹3,499",
    image: "/assasin.jpg",
  },
  {
    id: "4",
    title: "Last of Us II",
    price: "₹3,999",
    image: "/last.jpg",
  },
  {
    id: "5",
    title: "Dead by Daylight",
    price: "Coming Soon",
    image: "/dead.jpg",
  },
];

function GameList({
  title,
  games,
  buttonText,
}: {
  title: string;
  games: typeof topSellers;
  buttonText: string;
}) {
  return (
    <div className="bg-[#121212] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
        >
          {buttonText}
        </Button>
      </div>
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.title}
              height={60}
              width={60}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <h4 className="text-white text-sm font-medium">{game.title}</h4>
              <p className="text-gray-400 text-sm">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopGames() {
  return (
    <section className="bg-[#121212] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GameList
            title="Top Sellers"
            games={topSellers}
            buttonText="view more"
          />
          <GameList
            title="Best Seller"
            games={bestSellers}
            buttonText="view more"
          />
          <GameList
            title="Top Upcoming game"
            games={upcomingGames}
            buttonText="view more"
          />
        </div>
      </div>
    </section>
  );
}
