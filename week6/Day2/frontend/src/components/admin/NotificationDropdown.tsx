"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  amount: string;
  date: string;
  read: boolean;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dummy notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Lorem Ipsum",
      amount: "$140",
      date: "Aug 15, 2025",
      read: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <Bell color="#232321" size={20} />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 p-4 rounded-2xl mt-2 w-[462px] bg-white shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="font-rubik font-semibold text-lg text-[#232321]">
              Notifications
            </h3>
            <button
              className="rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#232321] cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex flex-col">
                      <p className="font-open-sans font-semibold text-base text-[#232321] mb-1">
                        {notification.title}
                      </p>
                      <p className="font-open-sans font-semibold text-sm text-[#232321] mb-1">
                        {notification.amount}
                      </p>
                      <span className="font-open-sans font-semibold text-xs text-[#232321]/80">
                        {notification.date}
                      </span>
                    </div>
                  </div>
                  <span className="font-open-sans font-semibold text-xs text-white py-1 px-2 rounded-sm bg-[#003F62]">
                    Sold
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between pt-3 border-t border-gray-200 gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center font-rubik text-[#232321] font-medium text-xs w-full cursor-pointer"
            >
              <Check size={16} className="mr-1" /> MARK ALL AS READ
            </button>
            <button className="py-2 px-4 rounded-lg border border-[#232321] transition-all duration-300 ease-in-out bg-[#003F62] text-white font-rubik font-medium text-xs w-full cursor-pointer hover:bg-transparent hover:text-[#232321]">
              VIEW ALL NOTIFICATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
