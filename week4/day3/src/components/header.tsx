"use client";

import { useState } from "react";
import { Globe, User, Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#2A2A2A] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <img src="/logo.png" className="bg-black"></img>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-white hover:text-blue-400 font-medium hover:border-b-2 hover:border-blue-500 "
              >
                STORE
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white hover:border-blue-500 hover:border-b-2"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white hover:border-blue-500 hover:border-b-2"
              >
                HELP
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white hover:border-blue-500 hover:border-b-2"
              >
                UNREAL ENGINE
              </a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                EN
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                SIGN IN
              </Button>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                DOWNLOAD
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-white hover:text-blue-400">
                STORE
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                HELP
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                UNREAL ENGINE
              </a>
            </nav>

            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white w-full justify-start"
              >
                <Globe className="w-4 h-4 mr-2" />
                EN
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white w-full justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                SIGN IN
              </Button>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                DOWNLOAD
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
