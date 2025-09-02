"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const profileNavItems = [
  {
    label: "Personal Information",
    href: "/profile",
  },
  {
    label: "My Cars",
    href: "/profile/my-cars",
  },
  {
    label: "My Bids",
    href: "/profile/my-bids",
  },
  {
    label: "Wishlist",
    href: "/profile/wishlist",
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <nav className="space-y-1 p-4">
        {profileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-[#4A5AAF] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#4A5AAF]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
