"use client";

import { ArrowUp, EllipsisVertical } from "lucide-react";
import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  subtitle: string;
  totalPrice: number;
  icon: ReactNode;
  count: number;
};

const DashboardCard = ({
  title,
  subtitle,
  totalPrice,
  icon,
  count,
}: DashboardCardProps) => {
  // Use NEXT_PUBLIC_ env variable for Next.js
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  return (
    <div className="py-6 px-4 bg-[#fafafa] rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="font-rubik font-semibold text-sm text-black">{title}</p>
        <EllipsisVertical />
      </div>

      {/* Body */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <div className="p-2.5 bg-[#003F62] rounded-lg">{icon}</div>
          <p className="font-rubik font-bold text-base text-black">
            {currencySymbol}
            {totalPrice}
          </p>
        </div>
        <div className="flex items-center gap-x-1">
          <ArrowUp />
          <p className="font-open-sans font-semibold text-sm text-black">
            {count}%
          </p>
        </div>
      </div>

      {/* Subtitle */}
      <p className="font-open-sans font-semibold text-xs text-black/70 text-end mt-2">
        {subtitle}
      </p>
    </div>
  );
};

export default DashboardCard;
