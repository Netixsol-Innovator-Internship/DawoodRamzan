/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, User } from "lucide-react";

// ✅ API hooks
import { useGetAuctionByIdQuery } from "@/services/auctionApi";
import {
  useGetBidsByAuctionQuery,
  useGetHighestBidQuery,
  useCreateBidMutation,
} from "@/services/bidsApi";
import { useGetCarByIdQuery } from "@/services/carsApi";
import { useGetUserByIdQuery } from "@/services/usersApi";

export default function AuctionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  // Auction
  const {
    data: auction,
    isLoading: auctionLoading,
    isError: auctionError,
  } = useGetAuctionByIdQuery(id, { skip: !id });

  // Car
  const {
    data: car,
    isLoading: carLoading,
    isError: carError,
  } = useGetCarByIdQuery(auction?.car?._id, {
    skip: !auction?.car?._id,
  });

  // Bids
  const { data: bids } = useGetBidsByAuctionQuery(id, { skip: !id });
  const { data: highestBid } = useGetHighestBidQuery(id, { skip: !id });

  // ✅ Extract bidder id properly
  const highestBidderId =
    typeof highestBid?.bidder === "string"
      ? highestBid.bidder
      : highestBid?.bidder?._id;

  // Highest Bidder
  const { data: highestBidder } = useGetUserByIdQuery(highestBidderId ?? "", {
    skip: !highestBidderId,
  });

  // Place bid mutation
  const [createBid] = useCreateBidMutation();

  // Local state for bid input
  const [bidAmount, setBidAmount] = useState<number>(0);

  // Auction status
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  // ✅ Live countdown state
  const [timeRemaining, setTimeRemaining] = useState<
    | { days: number; hours: number; minutes: number; seconds: number }
    | string
    | null
  >(null);

  // Initialize bidAmount once auction/highestBid loads
  useEffect(() => {
    if (auction) {
      setBidAmount(
        (highestBid?.amount || auction?.startingPrice || 0) +
          (auction?.bidIncrement || 100)
      );
    }
  }, [auction, highestBid]);

  // ✅ Track auction time every second
  useEffect(() => {
    if (!auction?.endTime) return;

    const interval = setInterval(() => {
      const end = new Date(auction.endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setIsAuctionEnded(true);
        setTimeRemaining("Auction Ended");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  // ✅ Current user ID from localStorage
  const userid =
    typeof window !== "undefined" ? localStorage.getItem("id") : "";

  // Handle bid submit
  const handleSubmitBid = async () => {
    try {
      await createBid({
        auction: String(id),
        bidder: String(userid),
        amount: bidAmount,
      }).unwrap();

      setBidAmount(bidAmount + (auction?.bidIncrement || 100));
    } catch (err) {
      console.error("Bid submission failed", err);
    }
  };

  // Handle payment redirect
  const handlePayment = () => {
    router.push("/auction");
  };

  if (auctionLoading || carLoading) return <div>Loading...</div>;
  if (auctionError || carError) return <div>Error loading auction</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title={car?.make || "Auction Detail"}
        description={car?.description || ""}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction Detail", href: `/auction/${id}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Car Title Bar */}
        <div className="bg-blue-900 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{car?.make}</h1>
          <button className="p-2">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Auction Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              {!isAuctionEnded &&
              timeRemaining &&
              typeof timeRemaining !== "string" ? (
                <>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-2xl font-bold">
                      {timeRemaining.days}
                    </div>
                    <div className="text-sm text-gray-600">Days left</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-2xl font-bold">
                      {timeRemaining.hours}
                    </div>
                    <div className="text-sm text-gray-600">Hours</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-2xl font-bold">
                      {timeRemaining.minutes}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="text-2xl font-bold">
                      {timeRemaining.seconds}
                    </div>
                    <div className="text-sm text-gray-600">Seconds</div>
                  </div>
                </>
              ) : (
                <div className="col-span-4 text-red-500 font-semibold">
                  Auction Ended
                </div>
              )}

              <div className="bg-gray-100 p-4 rounded">
                <div className="text-2xl font-bold">
                  $
                  {highestBid?.amount?.toLocaleString() ||
                    auction?.startingPrice}
                </div>
                <div className="text-sm text-gray-600">Current Bid</div>
              </div>

              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm">
                  {new Date(auction?.endTime!).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">End Time</div>
              </div>
            </div>

            {/* Car Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-lg font-bold">{auction?.bidIncrement}</div>
                <div className="text-sm text-gray-600">Bid Increment</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-lg font-bold">{bids?.length}</div>
                <div className="text-sm text-gray-600">Total Bids</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm font-bold">{car?.vin}</div>
                <div className="text-sm text-gray-600">VIN</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-lg font-bold">{car?.mileage} K.M</div>
                <div className="text-sm text-gray-600">Mileage</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-600">{car?.description}</p>
            </div>

            {/* Top Bidder */}
            {highestBidder && (
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Top Bidder</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div>
                      <div className="text-sm text-gray-300">Full Name</div>
                      <div className="font-medium">
                        {highestBidder.firstName} {highestBidder.lastName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Email</div>
                      <div className="font-medium">{highestBidder.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Mobile Number</div>
                      <div className="font-medium">{highestBidder.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Nationality</div>
                      <div className="font-medium">
                        {highestBidder.nationality}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bidding */}
          <div className="space-y-6">
            {!isAuctionEnded ? (
              <>
                {/* Current Bid Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    $
                    {highestBid?.amount?.toLocaleString() ||
                      auction?.startingPrice}
                  </div>
                  <div className="text-gray-600">Current Bid</div>
                </div>

                {/* Bid Input */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold">{bids?.length}</div>
                    <div className="text-sm text-gray-600">Bid Placed</div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBidAmount(
                          Math.max(
                            bidAmount - (auction?.bidIncrement || 100),
                            (highestBid?.amount || auction?.startingPrice) +
                              (auction?.bidIncrement || 100)
                          )
                        )
                      }
                    >
                      -
                    </Button>
                    <Input
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBidAmount(bidAmount + (auction?.bidIncrement || 100))
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmitBid}
                  >
                    Submit A Bid
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Auction Ended
                </h3>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handlePayment}
                >
                  Make Payment
                </Button>
              </div>
            )}

            {/* Bidders List */}
            <div className="bg-blue-900 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Bidders List</h3>
              <div className="space-y-3">
                {bids?.map((bid, index) => {
                  const bidderId =
                    typeof bid.bidder === "string"
                      ? bid.bidder
                      : bid.bidder?._id;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>User {String(highestBidder?.firstName)}</span>
                      <span className="font-semibold">${bid.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
