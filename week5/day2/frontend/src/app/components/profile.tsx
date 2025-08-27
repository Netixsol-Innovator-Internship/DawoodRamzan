"use client";
import React, { useEffect, useState } from "react";
import { getUserDetails } from "../lib/api"; // 👈 make sure you have this API

interface PublicUser {
  _id: string;
  username: string;
  bio?: string;
  followers: string[];
}

interface ProfileProps {
  userId: string;
}

export default function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState<PublicUser | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getUserDetails(userId);
        setProfile(user);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    fetchProfile();
  }, [userId]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-gray-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
        <p className="text-gray-600 text-center mt-2">
          {profile.bio || "No bio available"}
        </p>
        <div className="mt-4 flex space-x-6">
          <div className="text-center">
            <span className="block text-xl font-bold text-blue-600">
              {profile.followers.length}
            </span>
            <span className="text-gray-500 text-sm">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
