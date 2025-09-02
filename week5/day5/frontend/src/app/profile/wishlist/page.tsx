/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useGetUserByIdQuery } from "@/services/usersApi";
import { carsApi } from "@/services/carsApi"; // ✅ import RTK Query slice
import { skipToken } from "@reduxjs/toolkit/query";

interface Car {
  _id: string;
  make: string;
  model?: string;
  image?: string;
  description?: string;
  price?: string;
  currentBid?: string;
  endTime?: string;
  rating?: number;
  trending?: boolean;
}

export default function WishlistPage() {
  const dispatch = useDispatch();

  // ✅ get userId from localStorage
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setUserId(storedId);
  }, []);

  // ✅ fetch user
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserByIdQuery(userId ?? skipToken);

  // ✅ local state for cars
  const [wishlistCars, setWishlistCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carsError, setCarsError] = useState(false);

  // ✅ fetch wishlist cars after user loads
  useEffect(() => {
    const fetchCars = async () => {
      if (!user?.wishlist || user.wishlist.length === 0) {
        setWishlistCars([]);
        return;
      }

      try {
        setLoadingCars(true);
        setCarsError(false);

        // parallel fetch with Promise.all
        const results = await Promise.all(
          user.wishlist.map(async (carId: string) => {
            const result = await dispatch(
              carsApi.endpoints.getCarById.initiate(carId)
            ).unwrap();
            return result;
          })
        );

        setWishlistCars(results);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCarsError(true);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, [user, dispatch]);

  if (userLoading) {
    return <p className="p-4">Loading wishlist...</p>;
  }

  if (userError) {
    return (
      <p className="p-4 text-red-500">Failed to load user wishlist details.</p>
    );
  }

  return (
    <div>
      <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">
          Wishlist ({wishlistCars.length})
        </h2>
      </div>

      <div className="bg-white border border-t-0 rounded-b-lg p-6">
        {loadingCars ? (
          <p className="text-center text-gray-500">Loading cars...</p>
        ) : carsError ? (
          <p className="text-center text-red-500">Error fetching cars.</p>
        ) : wishlistCars.length === 0 ? (
          <p className="text-center text-gray-500">No cars in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlistCars.map((car) => (
              <Card key={car._id} className="overflow-hidden">
                <div className="relative">
                  {car.trending && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                      Trending
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </Button>
                  <img
                    src={"/hero.jpg"}
                    alt={"Car"}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {car.make} {car.model || ""}
                  </h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (car.rating || 4)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {car.description || "No description available"}
                  </p>
                  <p className="text-xs text-[#4A5AAF] mb-3">View Details</p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xl font-bold text-[#4A5AAF]">
                        {car.price || "$0"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {car.currentBid || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">--</p>
                      <p className="text-sm text-gray-600">Total Bids</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <div className="flex space-x-2">
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                      <span>--</span>
                    </div>
                    <span>{car.endTime || "--"}</span>
                  </div>

                  <Button className="w-full bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white">
                    Submit A Bid
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
