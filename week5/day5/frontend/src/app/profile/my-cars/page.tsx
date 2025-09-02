"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCarsByUserQuery } from "@/services/carsApi"; // ✅ RTK Query hook

interface UserAuth {
  id: string | null;
  token: string | null;
}

export default function MyCarsPage() {
  const [auth, setAuth] = useState<UserAuth>({ id: null, token: null });

  // ✅ Load token & id from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id"); // ✅ use "id" just like ProfilePage
    if (token && id) {
      setAuth({ token, id });
    }
  }, []);

  // ✅ Fetch cars by user only if id exists
  const {
    data: cars = [],
    isLoading,
    isError,
  } = useGetCarsByUserQuery(auth.id!, {
    skip: !auth.id || !auth.token, // ✅ skip if missing token or id
  });

  // ✅ Handle not logged in
  if (!auth.id || !auth.token) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Please login to view your cars.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading your cars...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load cars. Try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">My Cars</h2>
      </div>

      <div className="bg-white border border-t-0 rounded-b-lg p-6">
        {cars.length === 0 ? (
          <p className="text-center text-gray-500">No cars found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cars.map((car) => (
              <Card key={car._id} className="overflow-hidden">
                <div className="relative">
                  {car.currentPrice > car.reservePrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                      Trending
                    </Badge>
                  )}
                  <img
                    src={"/hero.jpg"}
                    alt={"Car"}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {car.make} {car.model} ({car.year})
                  </h3>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-blue-600">
                        ${car.reservePrice}
                      </p>
                      <p className="text-xs text-gray-500">Reserve Price</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">
                        ${car.currentPrice}
                      </p>
                      <p className="text-xs text-gray-500">Current Bid</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <div>{new Date(car.auctionEnd).toLocaleDateString()}</div>
                    <div className="text-right">
                      <p className="font-semibold">{car.mileage}</p>
                      <p>Mileage</p>
                    </div>
                  </div>

                  {car.status === "active" ? (
                    <Button className="w-full bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white">
                      End Bid
                    </Button>
                  ) : (
                    <Button className="w-full bg-gray-400 text-white" disabled>
                      Sold
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
