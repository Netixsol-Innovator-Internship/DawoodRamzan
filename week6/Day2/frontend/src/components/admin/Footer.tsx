"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-[#232321]/20 mt-24 px-4">
      <div className="flex md:flex-row flex-col items-center justify-between py-4">
        <p className="font-open-sans font-normal text-sm text-[#232321]">
          © 2025 Arik. All rights reserved.
        </p>

        <div className="flex items-center gap-x-4 md:mt-0 mt-4">
          <Link
            href="/about"
            className="font-open-sans font-semibold text-sm text-[#232321] hover:text-[#003F62]"
          >
            About
          </Link>
          <Link
            href="/careers"
            className="font-open-sans font-semibold text-sm text-[#232321] hover:text-[#003F62]"
          >
            Careers
          </Link>
          <Link
            href="/policy"
            className="font-open-sans font-semibold text-sm text-[#232321] hover:text-[#003F62]"
          >
            Policy
          </Link>
          <Link
            href="/contact"
            className="font-open-sans font-semibold text-sm text-[#232321] hover:text-[#003F62]"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
