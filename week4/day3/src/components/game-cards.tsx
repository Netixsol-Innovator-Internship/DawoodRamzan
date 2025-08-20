"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

const featuredGames = [
  {
    id: "1",
    title: "NFS UNBOUND",
    image: "/Unbound.jpg",
    description:
      "Pre-purchase NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,499",
  },
  {
    id: "2",
    title: "FIFA 23",
    image: "/fifa.jpg",
    description:
      "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup.",
    price: "₹3,699",
  },
  {
    id: "3",
    title: "UNCHARTED 4",
    image: "/Uncharted.jpg",
    description:
      "Get the definitive Uncharted 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,199",
  },
];

export function GameCards() {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<
    (typeof featuredGames)[0] | null
  >(null);

  const handleOpen = (game: (typeof featuredGames)[0]) => {
    setSelectedGame(game);
    setOpen(true);
  };

  return (
    <section className="bg-[#121212] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <Card
              key={game.id}
              className="bg-[#121212] hover:bg-gray-800 border-0 transition-colors flex flex-col h-full cursor-pointer"
              onClick={() => handleOpen(game)}
            >
              <div className="relative w-full h-48 flex items-center justify-center p-4">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  width={430}
                  height={150}
                  className="object-contain"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-lg mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                  {game.description}
                </p>
                <div className="text-white font-bold text-lg mt-auto">
                  {game.price}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ✅ Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1a1a1a] text-white max-w-lg">
          {selectedGame && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedGame.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Image
                  src={selectedGame.image}
                  alt={selectedGame.title}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full"
                />
                <p className="text-gray-300">{selectedGame.description}</p>
                <div className="text-xl font-bold">{selectedGame.price}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
