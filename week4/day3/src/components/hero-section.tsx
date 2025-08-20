"use client";

import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import Image from "next/image";

export function HeroSection() {
  const { selectedGame, setSelectedGame } = useGameStore();
  const sidebarGames = [
    {
      id: 1,
      title: "God Of War 4",
      image: "/her.jpg",
      description:
        "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive.",
    },
    {
      id: 2,
      title: "Farcry 6 Golden Edition",
      image: "/far.jpg",
      description:
        "Experience the revolution in Yara with stunning visuals and explosive gameplay.",
    },
    {
      id: 3,
      title: "GTA V",
      image: "/gta.jpg",
      description:
        "Step into Los Santos for a story of crime, betrayal, and chaos.",
    },
    {
      id: 4,
      title: "Outlast 2",
      image: "/out.png",
      description:
        "A survival horror game that will test your courage and instincts.",
    },
  ];
  return (
    <section className="bg-[#121212] relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* 🔍 Top Bar with Search + Links */}
        <div className="flex flex-col lg:flex-row   text-white gap-2 mb-6">
          {/* Search Bar */}
          <div className="w-full lg:w-1/3">
            <input
              type="text"
              placeholder="🔍 Search Store..."
              className="bg-[#2A2A2A] border border-gray-700 p-2 text-white rounded-full placeholder-gray-400"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-blue-700">
              Discover
            </a>
            <a href="#" className="hover:text-blue-700">
              Browse
            </a>
            <a href="#" className="hover:text-blue-700">
              News
            </a>
          </div>
        </div>

        {/* Stretch both columns equally */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
          {/* Main Hero Content */}
          <div className="flex-1  relative rounded-lg overflow-hidden min-h-[632px] w-[96] ">
            {/* Background Image */}
            {selectedGame && (
              <Image
                src={selectedGame.image}
                alt={selectedGame.title}
                fill
                className="2xl:object-cover object-contain rounded-lg"
                priority
              />
            )}
            {/* Gradient + Content */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-6">
              <div className="max-w-md space-y-4">
                <div className="text-sm text-green-400">
                  PRE-PURCHASE AVAILABLE
                </div>
                <p className="text-white text-sm">
                  Kratos now lives as a man in the realm of Norse Gods and
                  monsters. It is in this harsh, unforgiving world that he must
                  fight to survive
                </p>
                <Button className="bg-white hover:bg-blue-700 text-black hover:text-white">
                  PRE-PURCHASE NOW
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Games */}
          <div className="w-full lg:w-80 flex flex-col space-y-16 h-full">
            {sidebarGames.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="hover:bg-gray-800 rounded-lg p-4 flex items-center space-x-4 cursor-pointer"
              >
                <Image
                  src={game.image}
                  alt={game.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded object-cover"
                />
                <h3 className="text-white font-medium">{game.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
