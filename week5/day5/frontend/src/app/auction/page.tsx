"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/page-header";
import { BiddersList } from "@/components/bidders-list";
import { PaymentSteps } from "@/components/payment-steps";
import { Star } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Mock data - in a real app, this would come from props or API
const carData = {
  id: "audi-q3",
  name: "Audi Q3",
  images: [
    "/range-rover-white-suv.png",
    "/kia-carnival-blue-suv.png",
    "/mahindra-thar-red-suv.png",
    "/maruti-brezza-blue-suv.png",
    "/tata-nexon-red-suv.png",
    "/hyundai-verna-white-sedan.png",
  ],
  date: "14/03/2022",
  time: "06:00pm",
  winningBid: "$60,000",
  currentBid: "$60,000",
  auctionId: "379931",
  description: `Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Tempus sit rhoncus elit adipiscing nibh non gravida. Ipsum sit feugiat et elit elementum sit nec suspendisse. Ut sapien metus elementum bibendum eleifend.

In sed eget turpis vitae non arcu. Commodo viterra sed pellentesque ac nunc placerat amet vitae. Ultricies velit commodo blandit adipiscing elementum lorem dolor amet. Odio leo sit ut, ut porta dolor amet. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.`,
  winner: {
    name: "Manish Sharma",
    email: "Manish Sharma",
    mobile: "1234567890",
    nationality: "India",
    idType: "India",
    avatar: "/user-avatar.png",
  },
};

const bidders = [
  { id: "1", name: "Bidder 1", amount: 16000 },
  { id: "2", name: "Bidder 2", amount: 14200 },
  { id: "3", name: "Bidder 3", amount: 16000 },
];

const paymentSteps = [
  {
    id: "1",
    date: "14/03/2022",
    time: "06:00pm",
    winningBid: "$60,000",
    status: "completed" as const,
    label: "Ready For Shipping",
  },
  {
    id: "2",
    date: "21/04/2022",
    time: "",
    winningBid: "",
    status: "current" as const,
    label: "Ready For Shipping",
  },
  {
    id: "3",
    date: "15/03/2022",
    time: "06:00pm",
    winningBid: "$60,000",
    status: "pending" as const,
    label: "",
  },
];

export default function AuctionDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title={carData.name}
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction Detail" },
        ]}
      />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Content */}
          <div className="bg-white rounded-lg border border-gray-200 mb-8">
            <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">{carData.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Star className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Gallery */}
                <div className="lg:col-span-2">
                  <div className="relative mb-4">
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
                      Trending
                    </Badge>
                    <img
                      src={"/hero.jpg"}
                      alt={"CAR"}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-6 gap-2">
                    {carData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index
                            ? "border-[#4A5AAF]"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={"/hero.jpg"}
                          alt={`${carData.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Car Details & Bidding */}
                <div className="space-y-6">
                  {/* Auction Info */}
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <span className="ml-2 font-medium">
                            {carData.date}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <span className="ml-2 font-medium">
                            {carData.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Winning Bid:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {carData.winningBid}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Auction ID:</span>
                          <span className="ml-2 font-medium">
                            {carData.auctionId}
                          </span>
                        </div>
                      </div>

                      <div className="text-center text-sm text-red-600 font-medium">
                        Note: Please make your payment in next 6 Days
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#4A5AAF] mb-1">
                          {carData.currentBid}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Winning Bid
                        </div>
                        <Button
                          className="w-full bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white"
                          onClick={() => setShowPayment(true)}
                        >
                          Make Payments
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bidders List */}
                  <BiddersList bidders={bidders} />
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {carData.description}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Winner Information */}
              <div className="mt-8">
                <Card>
                  <CardHeader className="bg-[#4A5AAF] text-white">
                    <CardTitle>Winner</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={carData.winner.avatar || "/placeholder.svg"}
                          alt={carData.winner.name}
                        />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-[#4A5AAF] font-medium">
                            Full Name
                          </div>
                          <div className="text-gray-900">
                            {carData.winner.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#4A5AAF] font-medium">
                            Email
                          </div>
                          <div className="text-gray-900">
                            {carData.winner.email}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#4A5AAF] font-medium">
                            Mobile Number
                          </div>
                          <div className="text-gray-900">
                            {carData.winner.mobile}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#4A5AAF] font-medium">
                            Nationality
                          </div>
                          <div className="text-gray-900">
                            {carData.winner.nationality}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-[#4A5AAF] font-medium">
                            ID Type
                          </div>
                          <div className="text-gray-900">
                            {carData.winner.idType}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Payment Steps - only visible when "Make Payments" clicked */}
          {showPayment && <PaymentSteps steps={paymentSteps} />}
        </div>
      </section>
      <Footer />
    </div>
  );
}
