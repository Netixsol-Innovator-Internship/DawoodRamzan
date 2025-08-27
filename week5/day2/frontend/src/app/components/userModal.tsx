"use client";

import React from "react";
import toast from "react-hot-toast";
import { toggleFollow, getUserDetails } from "../lib/api";
import { PublicUser } from "./types";

interface User {
  token: string;
  id: string;
  username: string;
  followers?: string[];
}

interface UserModalProps {
  user: User | null;
  modalUserDetails: PublicUser;
  setModalUserDetails: React.Dispatch<React.SetStateAction<PublicUser | null>>;
  setAuthorFollowersMap: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onClose: () => void;
}

export default function UserModal({
  user,
  modalUserDetails,
  setModalUserDetails,
  setAuthorFollowersMap,
  onClose,
}: UserModalProps) {
  async function handleFollowToggle() {
    if (!user) return toast.error("Login first");
    try {
      await toggleFollow(user.token, modalUserDetails._id);
      const details = await getUserDetails(modalUserDetails._id);
      const updatedFollowers: string[] = details?.followers || [];

      setModalUserDetails({ ...details, followers: updatedFollowers });
      setAuthorFollowersMap((prev) => ({
        ...prev,
        [modalUserDetails._id]: updatedFollowers,
      }));

      toast.success(
        updatedFollowers.includes(user.id)
          ? `Following ${modalUserDetails.username}`
          : `Unfollowed ${modalUserDetails.username}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle follow");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 relative shadow-lg">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto font-bold text-2xl mb-3">
            {modalUserDetails.username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <h2 className="text-lg font-semibold">{modalUserDetails.username}</h2>
          <p className="text-gray-500 text-sm mt-1">
            Followers: {modalUserDetails.followers?.length || 0}
          </p>
          {user && user.id !== modalUserDetails._id && (
            <button
              onClick={handleFollowToggle}
              className={`mt-3 text-sm px-4 py-2 rounded-xl font-medium transition ${
                modalUserDetails.followers?.includes(user.id)
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {modalUserDetails.followers?.includes(user.id)
                ? "Unfollow"
                : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
