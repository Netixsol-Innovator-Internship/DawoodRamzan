/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useGetActiveAuctionsQuery } from "@/services/auctionApi";
import type { Auction } from "@/types/auction";
import { useRouter } from "next/navigation";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserByIdQuery,
} from "@/services/usersApi";

export default function LiveAuction() {
  const { data: auctions, isLoading, isError } = useGetActiveAuctionsQuery();
  const router = useRouter();

  // ✅ auth + user
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");
    setToken(storedToken);
    setUserId(storedId);
  }, []);

  const { data: profile } = useGetUserByIdQuery(userId!, {
    skip: !token || !userId,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // ✅ Sync wishlist from backend
  useEffect(() => {
    if (profile?.wishlist) {
      setWishlist(profile.wishlist);
    }
  }, [profile]);

  const handleToggleWishlist = async (carId: string) => {
    if (!profile?._id) return;
    try {
      if (wishlist.includes(carId)) {
        await removeFromWishlist({ id: profile._id, carId }).unwrap();
        setWishlist((prev) => prev.filter((id) => id !== carId));
      } else {
        await addToWishlist({ id: profile._id, carId }).unwrap();
        setWishlist((prev) => [...prev, carId]);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  if (isLoading)
    return <p className="text-center text-white">Loading auctions...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load auctions.</p>;

  return (
    <div className="bg-[#4A5AAF] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Live Auction</h2>
          <div className="w-16 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="mb-8">
          <div className="inline-block bg-yellow-400 text-[#4A5AAF] px-6 py-2 rounded-full font-semibold">
            Live Auction
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions?.map((auction: Auction) => {
            const carId = auction?.car?._id;
            const inWishlist = wishlist.includes(carId);

            return (
              <div
                key={auction?._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Trending
                  </span>

                  {/* ✅ Wishlist button */}
                  {token && (
                    <button
                      className={`absolute top-3 right-3 transition-colors ${
                        inWishlist
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-400 hover:text-[#4A5AAF]"
                      }`}
                      onClick={() => handleToggleWishlist(carId)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          inWishlist ? "fill-yellow-400" : "fill-none"
                        }`}
                      />
                    </button>
                  )}

                  <img
                    src={auction?.car?.image || "hero.jpg"}
                    alt={auction?.car?.model || "Car"}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">
                    {auction?.car?.model || "N/A"}
                  </h3>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-[#4A5AAF]">
                      ${auction?.currentBid?.amount || 0}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(auction?.endTime).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Current Bid</span>
                    <span className="text-sm text-gray-600">
                      Waiting for Bid
                    </span>
                  </div>

                  <Button
                    className="w-full bg-[#4A5AAF] hover:bg-[#3d4a94] text-white"
                    onClick={() => router.push(`/auction/${auction._id}`)}
                  >
                    Submit A Bid
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
