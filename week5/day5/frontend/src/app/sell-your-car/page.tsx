"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCreateCarMutation } from "@/services/carsApi"; // ✅ Cars API
import { useCreateAuctionMutation } from "@/services/auctionApi"; // ✅ Auctions API

export default function SellYourCarPage() {
  const [createCar, { isLoading: isCarLoading }] = useCreateCarMutation();
  const [createAuction, { isLoading: isAuctionLoading }] =
    useCreateAuctionMutation();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    vin: "",
    photos: [] as File[],
    description: "",
    currentPrice: "",
    reservePrice: "",
    auctionEnd: "",
    maxBid: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        photos: Array.from(e.target.files),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: replace with actual image upload service (S3, Cloudinary, etc.)
      const photoUrls = formData.photos.map((file) => file.name);

      // Step 1: Create Car
      const carPayload = {
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        color: formData.color,
        mileage: Number(formData.mileage),
        vin: formData.vin,
        photos: photoUrls,
        description: formData.description,
        currentPrice: Number(formData.currentPrice),
        reservePrice: Number(formData.reservePrice),
        status: "active",
        auctionEnd: new Date(formData.auctionEnd).toISOString(),
        maxBid: Number(formData.maxBid),
      };

      const carResponse = await createCar(carPayload).unwrap();

      // Step 2: Create Auction linked to Car
      const auctionPayload = {
        car: carResponse._id, // ✅ car reference
        status: "active",
        startTime: new Date().toISOString(),
        endTime: new Date(formData.auctionEnd).toISOString(),
        currentBid: null,
        bids: [],
        bidCount: 0,
        maxBid: Number(formData.maxBid),
      };

      await createAuction(auctionPayload).unwrap();

      alert("Car and Auction created successfully!");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create car or auction");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="Sell Your Car"
        description="Provide details about your car to create a listing."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sell Your Car" }]}
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-[#4A5AAF]">Car Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Make & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Make*</Label>
                    <Input
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Model*</Label>
                    <Input
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Year & Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Year*</Label>
                    <Input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Color*</Label>
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Mileage & VIN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Mileage*</Label>
                    <Input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>VIN*</Label>
                    <Input
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Reserve & Current Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Current Price*</Label>
                    <Input
                      type="number"
                      name="currentPrice"
                      value={formData.currentPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Reserve Price*</Label>
                    <Input
                      type="number"
                      name="reservePrice"
                      value={formData.reservePrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Max Bid */}
                <div>
                  <Label>Max Bid*</Label>
                  <Input
                    type="number"
                    name="maxBid"
                    value={formData.maxBid}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description*</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Auction End Date */}
                <div>
                  <Label>Auction End*</Label>
                  <Input
                    type="datetime-local"
                    name="auctionEnd"
                    value={formData.auctionEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Photos */}
                <div>
                  <Label>Upload Photos*</Label>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload up to 50 high-quality photos
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-[#4A5AAF] hover:bg-[#3A4A9F] text-white px-12 py-3 text-lg"
                disabled={isCarLoading || isAuctionLoading}
              >
                {isCarLoading || isAuctionLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
