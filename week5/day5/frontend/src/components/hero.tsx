/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useSearchCarsQuery } from "@/services/carsApi";

export default function Hero() {
  // form state
  const [make, setMake] = useState<string | undefined>();
  const [model, setModel] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [filters, setFilters] = useState<Record<string, any> | null>(null);

  // API hook (only runs when filters is set)
  const {
    data: cars,
    isFetching,
    error,
  } = useSearchCarsQuery(filters!, {
    skip: !filters,
  });

  // handle Search
  const handleSearch = () => {
    const newFilters: Record<string, any> = {};
    if (make) newFilters.make = make;
    if (model) newFilters.model = model;
    if (year) newFilters.year = year;

    if (price) {
      const [min, max] = price.split("-");
      if (min) newFilters.minPrice = min;
      if (max && max !== "+") newFilters.maxPrice = max;
    }

    setFilters(newFilters);
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-32"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hero.jpg')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl">
          <div className="inline-block bg-blue-100 text-[#4A5AAF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            WELCOME TO AUCTION
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Dream Car
          </h1>
          <p className="text-white/90 mb-12 text-lg max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
            elementum cursus tincidunt sagittis elementum suspendisse velit
            arcu.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make
                </label>
                <Select onValueChange={setMake}>
                  <SelectTrigger>
                    <SelectValue placeholder="Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes</SelectItem>
                    <SelectItem value="porsche">Porsche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <Select onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corolla">Corolla</SelectItem>
                    <SelectItem value="a6">A6</SelectItem>
                    <SelectItem value="q5">Q5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <Select onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <Select onValueChange={setPrice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-25000">$0 - $25,000</SelectItem>
                    <SelectItem value="25000-50000">
                      $25,000 - $50,000
                    </SelectItem>
                    <SelectItem value="50000-+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-[#4A5AAF] hover:bg-[#3d4a94] text-white h-10"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-8">
            {isFetching && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-500">Failed to load cars</p>}
            {cars && cars.length === 0 && (
              <p className="text-white">No cars found.</p>
            )}
            {cars && cars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-white rounded-lg shadow p-4 flex flex-col"
                  >
                    <img
                      src={car.photos[0] || "/car-placeholder.png"}
                      alt={`${car.make} ${car.model}`}
                      className="h-40 w-full object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {car.year} • {car.color} • {car.mileage} miles
                    </p>
                    <p className="mt-2 font-bold text-[#4A5AAF]">
                      ${car.currentPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
