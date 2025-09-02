import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#4A5AAF] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-400 p-2 rounded-lg">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <div className="text-xl font-semibold">
                <span>Car </span>
                <span className="text-teal-400">Deposit</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit
              suscipit lacus cras commodo in lectus sed egestas. Mattis eget sit viverra pretium tincidunt libero.
              Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus
              viverra in sed mauris.
            </p>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <Link href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors">
                  <Twitter className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/help-center" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/my-account" className="block text-gray-300 hover:text-white transition-colors">
                My Account
              </Link>
              <Link href="/my-account" className="block text-gray-300 hover:text-white transition-colors">
                My Account
              </Link>
            </div>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Services</h4>
            <div className="space-y-2">
              <Link href="/car-auction" className="block text-gray-300 hover:text-white transition-colors">
                Car Auction
              </Link>
              <Link href="/help-center" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/my-account" className="block text-gray-300 hover:text-white transition-colors">
                My Account
              </Link>
              <Link href="/my-account" className="block text-gray-300 hover:text-white transition-colors">
                My Account
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-300">Hot Line Number</p>
                  <p className="font-medium">+054 211 4444</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-300">Email Id :</p>
                  <p className="font-medium">info@cardeposit.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-300">Office No 6, SKB Plaza next to Bentley showroom,</p>
                  <p className="text-sm text-gray-300">Umm Al Sheif Street, Sheikh Zayed Road, Dubai, UAE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-gray-300">
            <span className="font-medium">Copyright 2022</span> All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
