/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ArrowUpIcon, Ellipsis, PencilIcon, TrashIcon } from "lucide-react";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/lib/services/productsApi"; // ✅ your RTK service

interface ProductCardProps {
  id: string;
  title: string;
  productType: string;
  description: string;
  price: number;
  image: string;
  saleCount: number;
  remainingStock: number;
}

const ProductCard = ({
  id,
  title,
  productType,
  description,
  price,
  image,
  saleCount,
  remainingStock,
}: ProductCardProps) => {
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    productType,
    description,
    price,
  });
  console.log(id);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // ✅ Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct({
        id,
        body: {
          name: editData.title,
          category: editData.productType,
          description: editData.description,
          price: editData.price,
        },
      }).unwrap();
      alert("Product updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  // ✅ Handle delete with stock check
  const handleDelete = async () => {
    if (remainingStock > 0) {
      alert("Can't delete now. Wait until it's sold out.");
      return;
    }
    try {
      await deleteProduct(id).unwrap();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="py-6 px-4 bg-[#fafafa] rounded-2xl relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={image}
            alt={title}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg me-6 object-contain"
          ></img>
          <div className="flex flex-col items-start">
            <p className="font-open-sans font-semibold text-base text-[#232321]">
              {title}
            </p>
            <p className="font-open-sans font-semibold text-sm text-black/60 mb-4">
              {productType}
            </p>
            <p className="font-rubik font-semibold text-sm text-[#232321]">
              {currencySymbol}
              {price}
            </p>
          </div>
        </div>

        {/* Ellipsis menu */}
        <div
          className="bg-[#232321]/5 py-2 px-3 rounded-sm cursor-pointer relative"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Ellipsis className="text-[#232321]/50" />
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border z-10 w-32">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
              >
                <PencilIcon size={16} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                <TrashIcon size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col items-start gap-y-1 mb-4">
        <h3 className="font-open-sans font-semibold text-base text-[#232321]">
          Summary
        </h3>
        <p className="font-open-sans font-normal text-sm text-[#232321]/60 mb-4">
          {description}
        </p>
      </div>

      {/* Stats */}
      <div className="border border-[#232321]/30 rounded-lg p-4">
        <div className="flex items-center justify-between border-b border-[#232321]/40 pb-2">
          <p className="font-open-sans font-semibold text-sm text-[#232321]/80">
            Sales
          </p>
          <div className="flex items-center">
            <ArrowUpIcon size={20} color="#FFA52F" className="me-2.5" />
            <p className="font-open-sans font-semibold text-sm text-black/60">
              {saleCount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="font-open-sans font-semibold text-sm text-[#232321]/80">
            Remaining Products
          </p>
          <div className="flex items-center gap-x-2">
            <div className="w-16 h-2 bg-[#E7E7E3] rounded-lg shadow-sm overflow-hidden">
              <div
                className="h-2 bg-[#FFA52F] rounded-lg"
                style={{
                  width: `${Math.min(
                    100,
                    (remainingStock / (remainingStock + saleCount)) * 100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="font-open-sans font-semibold text-sm text-black/60">
              {remainingStock}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Product Title"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={editData.productType}
                onChange={(e) =>
                  setEditData({ ...editData, productType: e.target.value })
                }
                placeholder="Product Type"
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: Number(e.target.value) })
                }
                placeholder="Price"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
