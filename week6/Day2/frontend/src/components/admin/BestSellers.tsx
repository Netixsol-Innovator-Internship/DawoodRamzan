"use client";

import { EllipsisVertical } from "lucide-react";

type BestSellersProps = {
  title: string;
  subPrice: string;
  totalPrice: number;
  icon: string;
  count: number;
};

const BestSellers = ({ title, subPrice, totalPrice, icon, count }: BestSellersProps) => {
  // Replace with process.env.NEXT_PUBLIC_* variable in Next.js
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  return (
    <div className="py-6 px-4 bg-[#fafafa] rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b border-[#232321] pb-5">
        <p className="font-rubik font-semibold text-sm text-black">
          Best Sellers
        </p>
        <EllipsisVertical />
      </div>

      {/* Items */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="me-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt={title} className="w-16 h-16 rounded-lg" />
            </div>
            <div className="flex flex-col items-start">
              <p className="font-open-sans font-semibold text-base text-black">
                {title}
              </p>
              <p className="font-open-sans font-semibold text-sm text-black/60">
                {currencySymbol}
                {subPrice}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="font-rubik font-semibold text-base text-black">
              {currencySymbol}
              {totalPrice * (i + 1)}
            </p>
            <p className="font-open-sans font-semibold text-sm text-black/60">
              {count} sales
            </p>
          </div>
        </div>
      ))}

      {/* Report Button */}
      <button className="p-2.5 bg-[#003F62] text-white rounded-lg font-rubik font-medium text-sm mt-4">
        REPORT
      </button>
    </div>
  );
};

export default BestSellers;
