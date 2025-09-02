"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserByIdQuery,
} from "@/services/usersApi";

interface CarCardProps {
  id: string; // auction id
  carId: string; // car id
  name?: string; // car name
  image?: string;
  price?: string;
  currentBid?: string;
  timeLeft?: string;
  endTime?: string;
  description?: string;
  rating?: number;
  trending?: boolean;
}

export function CarCard({
  id,
  carId,
  name,
  image,
  price,
  currentBid,
  timeLeft,
  endTime,
  description,
  rating = 4,
  trending = false,
}: CarCardProps) {
  const router = useRouter();

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
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (profile?.wishlist) {
      setInWishlist(profile.wishlist.includes(carId));
    }
  }, [profile, carId]);

  const handleToggleWishlist = async () => {
    if (!profile?._id) return;

    try {
      if (inWishlist) {
        await removeFromWishlist({ id: profile._id, carId }).unwrap();
        setInWishlist(false);
      } else {
        await addToWishlist({ id: profile._id, carId }).unwrap();
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  // ✅ Redirect to auction detail page on Submit Bid
  const handleSubmitBid = () => {
    router.push(`/auction/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* Car Image */}
        <div className="relative w-48 h-32 flex-shrink-0">
          {trending && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              Trending
            </Badge>
          )}
          <img
            src={ "/hero.jpg"}
            alt={name || "Car"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Car Details */}
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-[#4A5AAF] mb-1">
                {name || "Unnamed Car"}
              </h3>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {description || "No description available"}
              </p>
            </div>

            {token && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleWishlist}
                className={`${
                  inWishlist
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-400 hover:text-[#4A5AAF]"
                }`}
              >
                <Star
                  className={`h-5 w-5 ${
                    inWishlist ? "fill-yellow-400" : "fill-none"
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-[#4A5AAF]">
                {price || "$0"}
              </p>
              <p className="text-sm text-gray-600">{currentBid || "N/A"}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{timeLeft || "--"}</p>
              <p className="text-sm text-gray-600">End Time</p>
            </div>
          </div>

          <Button
            className="w-full mt-3 bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white"
            onClick={handleSubmitBid} // ✅ Redirect
          >
            Submit A Bid
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
