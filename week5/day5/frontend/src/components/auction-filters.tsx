"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Filters {
  type?: string;
  color?: string;
  make?: string;
  model?: string;
  style?: string;
  priceRange: number[];
}

interface AuctionFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export function AuctionFilters({ filters, setFilters }: AuctionFiltersProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-[#4A5AAF] text-white">
        <CardTitle className="text-lg">Filter By</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Car Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Car Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(val) => setFilters({ ...filters, type: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select car type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Color
          </label>
          <Select
            value={filters.color}
            onValueChange={(val) => setFilters({ ...filters, color: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Make */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Makes
          </label>
          <Select
            value={filters.make}
            onValueChange={(val) => setFilters({ ...filters, make: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Car Model
          </label>
          <Select
            value={filters.model}
            onValueChange={(val) => setFilters({ ...filters, model: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="3-series">3 Series</SelectItem>
              <SelectItem value="c-class">C-Class</SelectItem>
              <SelectItem value="camry">Camry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any Style
          </label>
          <Select
            value={filters.style}
            onValueChange={(val) => setFilters({ ...filters, style: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="sport">Sport</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Price Range
          </label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(val) =>
                setFilters({ ...filters, priceRange: val })
              }
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#FFB800] hover:bg-[#E5A600] text-white font-semibold py-3">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
