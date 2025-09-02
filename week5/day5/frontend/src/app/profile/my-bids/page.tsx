/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useGetBidsByUserQuery } from "@/services/bidsApi";
import { useGetUserByIdQuery } from "@/services/usersApi"; // ✅ use this instead of profile
import Image from "next/image";
import { skipToken } from "@reduxjs/toolkit/query";

export default function MyBidsPage() {
  // ✅ local state for auth
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const storedToken = localStorage.getItem("token");
    setUserId(storedId);
    setToken(storedToken);
  }, []);

  // ✅ fetch user if id + token exist
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserByIdQuery(userId && token ? userId : skipToken);

  console.log(user);
  // ✅ fetch bids dynamically (only when user exists)
  const {
    data: bids,
    isLoading: bidsLoading,
    isError: bidsError,
  } = useGetBidsByUserQuery(user?._id ?? skipToken);
  console.log("Bids", bids);
  if (!userId || !token) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Please login to view your bids.</p>
      </div>
    );
  }

  if (userLoading || bidsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your bids...</p>
      </div>
    );
  }

  if (userError || bidsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load your bids.</p>
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div>
        <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">My Bids</h2>
        </div>
        <div className="bg-white border border-t-0 rounded-b-lg p-6 text-center">
          <p className="text-gray-500">You haven’t placed any bids yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">My Bids</h2>
      </div>

      <div className="bg-white border border-t-0 rounded-b-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bids.map((bid: any) => (
            <Card key={bid._id} className="overflow-hidden">
              <div className="relative">
                {/* Show trending if auction has many bids */}
                {bid.auction?.bids?.length > 50 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                    Trending
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Image
                  src={"/hero.jpg"}
                  alt={"Car"}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {bid.auction?.car?.name || "Unknown Car"}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-blue-600">
                      ${bid.auction?.highestBid?.amount || "0"}
                    </p>
                    <p className="text-xs text-gray-500">Winning Bid</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">${bid.amount}</p>
                    <p className="text-xs text-gray-500">Your Current Bid</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <div className="flex space-x-2">
                    <span>
                      {bid.auction?.endTime
                        ? new Date(bid.auction.endTime).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {bid.auction?.bids?.length || 0}
                    </p>
                    <p>Total Bids</p>
                  </div>
                </div>

                <Button className="w-full bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white">
                  Submit A Bid
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
