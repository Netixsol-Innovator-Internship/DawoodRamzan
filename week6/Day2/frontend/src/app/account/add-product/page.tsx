"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/admin/Title";
import { useCreateProductMutation } from "@/lib/services/productsApi";

const categories = ["T-shirts", "Shorts", "Shirts", "Hoods", "Jeans"];
const sizes = [
  "xx-small",
  "x-small",
  "small",
  "medium",
  "large",
  "x-large",
  "xx-large",
  "3x-large",
  "4x-large",
];
const dressStyles = ["Casual", "Formal", "Party", "Gym"];
const colors = ["White", "Blue", "Green", "Red", "Black", "Grey", "Brown"]; // ✅ colors list

export default function AddProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [points, setPoints] = useState<number | "">("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [dressStyle, setDressStyle] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // ✅ new color state
  const [isActive, setIsActive] = useState(true);

  // Tag handlers
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Size toggle
  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const DEFAULT_IMAGE =
    "https://res.cloudinary.com/dusclm57c/image/upload/v1756983373/CHECKERED_SHIRT_tgs1a8.png";

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProduct({
        name,
        price: Number(price),
        salePrice: Number(salePrice),
        points: Number(points),
        stockQuantity: Number(stockQuantity),
        brand,
        description,
        tags,
        images: [DEFAULT_IMAGE], // ✅ always set default image
        category,
        sizes: selectedSizes,
        dressStyle,
        color: selectedColor, // ✅ send selected color
        isActive,
      }).unwrap();

      alert("Product created successfully!");
      router.push("/account/dashboard");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Error creating product");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Title
          title="Add New Product"
          subtitle="Home > All Products > Add New Product"
        />
      </div>

      <div className="py-6 px-4 bg-[#fafafa] rounded-2xl mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side */}
            <div>
              {/* Product Name */}
              <label className="block font-semibold text-lg mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Type name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
                required
              />

              {/* Description */}
              <label className="block font-semibold text-lg mb-2">
                Description
              </label>
              <textarea
                placeholder="Type description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full h-[120px]"
                required
              />

              {/* Category */}
              <label className="block font-semibold text-lg mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Brand */}
              <label className="block font-semibold text-lg mb-2">
                Brand Name
              </label>
              <input
                type="text"
                placeholder="Type brand name here"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
                required
              />

              {/* Stock Quantity */}
              <label className="block font-semibold text-lg mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="1258"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.valueAsNumber)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
                required
              />

              {/* Prices */}
              <div className="flex gap-4 mb-6">
                <div className="w-full">
                  <label className="block font-semibold text-lg mb-2">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={price}
                    onChange={(e) => setPrice(e.target.valueAsNumber)}
                    className="py-2.5 px-6 rounded-lg border border-[#232321] w-full"
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block font-semibold text-lg mb-2">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    placeholder="450"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.valueAsNumber)}
                    className="py-2.5 px-6 rounded-lg border border-[#232321] w-full"
                  />
                </div>
              </div>

              {/* ✅ Points */}
              <label className="block font-semibold text-lg mb-2">
                Reward Points
              </label>
              <input
                type="number"
                placeholder="100"
                value={points}
                onChange={(e) => setPoints(e.target.valueAsNumber)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
              />

              {/* Tags */}
              <label className="block font-semibold text-lg mb-2">Tags</label>
              <div className="py-2.5 px-6 rounded-lg border border-[#232321] w-full mb-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#36323B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value;
                      handleAddTag(value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="w-full outline-none py-2 text-sm bg-transparent"
                />
              </div>
            </div>

            {/* Right Side */}
            <div>
              {/* Sizes */}
              <label className="block font-semibold text-lg mb-2">Sizes</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedSizes.includes(size)
                        ? "bg-[#003F62] text-white"
                        : "bg-white text-[#232321] border-[#232321]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* ✅ Colors */}
              <label className="block font-semibold text-lg mb-2">Color</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {colors.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 border rounded-lg text-sm ${
                      selectedColor === c
                        ? "bg-[#003F62] text-white"
                        : "bg-white text-[#232321] border-[#232321]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Dress Style */}
              <label className="block font-semibold text-lg mb-2">
                Dress Style
              </label>
              <select
                value={dressStyle}
                onChange={(e) => setDressStyle(e.target.value)}
                className="py-2.5 px-6 mb-6 rounded-lg border border-[#232321] w-full"
                required
              >
                <option value="">Select dress style</option>
                {dressStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-[#232321]">
                  Active
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 w-full mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-2.5 px-6 rounded-lg border border-[#232321] bg-[#003F62] text-white font-medium text-sm w-full hover:bg-transparent hover:text-[#232321] transition disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "ADD"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/account/dashboard")}
                  className="py-2.5 px-6 rounded-lg border border-[#232321] bg-transparent text-[#232321] font-medium text-sm w-full hover:bg-[#003F62] hover:text-white transition"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
