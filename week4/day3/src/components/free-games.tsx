"use client";

import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const freeGames = [
  {
    id: "1",
    title: "Darkwood",
    image: "/dark.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "2",
    title: "Assassin's Creed Black Flag",
    image: "/Darkwood.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "3",
    title: "NFS : Shift",
    image: "/shift.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
  {
    id: "4",
    title: "Warface",
    image: "/war.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
];

export function FreeGames() {
  return (
    <section className="bg-[#121212] py-8">
      <div className="container bg-[#2A2A2A] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 text-white" />
            <h2 className="text-white text-2xl font-bold">Free Games</h2>
          </div>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            View More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeGames.map((game) => (
            <Card
              key={game.id}
              className="bg-[#2A2A2A] border-[#2A2A2A] overflow-hidden hover:bg-gray-750 transition-colors"
            >
              <div className="relative">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full max-h-96 object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-2">{game.title}</h3>
                <p className="text-gray-400 text-sm">{game.availability}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
