"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { CarCard } from "@/components/car-card";
import { AuctionFilters } from "@/components/auction-filters";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useGetAllAuctionsQuery } from "@/services/auctionApi";
import type { Auction } from "@/types/auction";

export default function CarAuctionPage() {
  const { data: auctions, isLoading, isError } = useGetAllAuctionsQuery();
  console.log("Auctions page", auctions);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction" }]}
      />

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-[#4A5AAF] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
                <span className="font-medium">
                  {isLoading
                    ? "Loading results..."
                    : isError
                    ? "Failed to load auctions"
                    : `Showing ${auctions?.length || 0} Results`}
                </span>
                <Select defaultValue="sort-by-relevance">
                  <SelectTrigger className="w-48 bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sort-by-relevance">
                      Sort by Relevance
                    </SelectItem>
                    <SelectItem value="price-low-high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high-low">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Car Listings */}
              <div className="space-y-4 bg-white border border-t-0 rounded-b-lg p-6">
                {isLoading && <p>Loading auctions...</p>}
                {isError && (
                  <p className="text-red-500">Error fetching auctions.</p>
                )}
                {auctions?.map((auction: Auction) => (
                  <CarCard
                    key={auction._id}
                    id={auction._id} // auction id
                    carId={
                      typeof auction.car === "string"
                        ? auction.car // if just ObjectId
                        : auction.car?._id // if populated object
                    }
                    name={
                      typeof auction.car === "object"
                        ? auction.car?.make // populated car details
                        : "Unknown Car"
                    }
                    image="/placeholder.svg" // replace with car image if available in backend
                    price={auction?.currentBid?.amount || "$0"}
                    currentBid="Current Bid"
                    timeLeft="--"
                    endTime={new Date(auction.endTime).toLocaleString()}
                    description="Car description not provided"
                    rating={4}
                  />
                ))}
              </div>

              {/* Pagination (static for now) */}
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="default" className="bg-[#4A5AAF] text-white">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">4</Button>
                <Button variant="outline">5</Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline">10</Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="w-80 flex-shrink-0">
              <AuctionFilters />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
