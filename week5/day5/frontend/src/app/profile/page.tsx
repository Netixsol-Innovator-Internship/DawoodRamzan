"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import { useGetUserByIdQuery } from "@/services/usersApi";



export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Get token & id from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedId = localStorage.getItem("id");
    setToken(storedToken);
    setUserId(storedId);
    console.log("Stored Token:", storedToken, "Stored Id:", storedId);
  }, []);

  // ✅ Fetch user info only if token & id exist
  const {
    data: user,
    isLoading,
    error,
  } = useGetUserByIdQuery(userId!, {
    skip: !token || !userId,
  });

  // ✅ Handle not logged in
  if (!token || !userId) {
    return (
      <p className="text-center text-red-500 mt-10">
        ⚠️ Please log in to view your profile.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load profile</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-500">No user found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="bg-[#4A5AAF] text-white flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user.avatar || "/user-avatar.png"}
                alt="Profile"
              />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#4A5AAF] font-medium">Full Name</Label>
                <div className="mt-1 text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
              </div>
              <div>
                <Label className="text-[#4A5AAF] font-medium">Email</Label>
                <div className="mt-1 text-gray-900">{user.email}</div>
              </div>
              <div>
                <Label className="text-[#4A5AAF] font-medium">Phone</Label>
                <div className="mt-1 text-gray-900">{user.phone || "--"}</div>
              </div>
              <div>
                <Label className="text-[#4A5AAF] font-medium">Address</Label>
                <div className="mt-1 text-gray-900">{user.address || "--"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password (placeholder) */}
      <Card>
        <CardHeader className="bg-[#4A5AAF] text-white flex flex-row items-center justify-between">
          <CardTitle>Password</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div>
            <Label className="text-[#4A5AAF] font-medium">Password</Label>
            <div className="mt-1 text-gray-900">••••••••</div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist
      <Card>
        <CardHeader className="bg-[#4A5AAF] text-white flex flex-row items-center justify-between">
          <CardTitle>Wishlist</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {user.wishlist && user.wishlist.length > 0 ? (
            <ul className="list-disc list-inside text-gray-900">
              {user.wishlist.map((carId: string) => (
                <li key={carId}>{carId}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No cars in wishlist</p>
          )}
        </CardContent>
      </Card> */}

      {/* Cars & Bids */}
      {/* <Card>
        <CardHeader className="bg-[#4A5AAF] text-white flex flex-row items-center justify-between">
          <CardTitle>My Cars & Bids</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-[#4A5AAF] font-medium">My Cars</Label>
            <div className="mt-1 text-gray-900">
              {user.myCars && user.myCars.length > 0 ? (
                <ul className="list-disc list-inside">
                  {user.myCars.map((car: string) => (
                    <li key={car}>{car}</li>
                  ))}
                </ul>
              ) : (
                "No cars listed"
              )}
            </div>
          </div>
          <div>
            <Label className="text-[#4A5AAF] font-medium">My Bids</Label>
            <div className="mt-1 text-gray-900">
              {user.myBids && user.myBids.length > 0 ? (
                <ul className="list-disc list-inside">
                  {user.myBids.map((bid: string) => (
                    <li key={bid}>{bid}</li>
                  ))}
                </ul>
              ) : (
                "No bids placed"
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
