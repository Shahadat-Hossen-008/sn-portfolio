"use client";
import Image from "next/image";
import logo from "@/../public/Personal Logo.png";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ cvUrl }: { cvUrl: string | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 lg:py-8 fixed top-0 z-100">
      <div
        className="grid grid-cols-2 lg:grid-cols-3
          items-center border border-white/15 rounded-full p-2 bg-black/30"
      >
        <div className="grid-col-1 flex items-center gap-2">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={48}
              height={48}
              className="object-contain rounded-full"
            />
          </Link>
        </div>
        <div className="hidden lg:flex justify-center">
          <nav className="flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-1 flex justify-end items-center gap-6 ">
          {cvUrl && (
            <Link
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#212121] rounded-full px-6.5 py-3 text-base transition-colors duration-300 hover:bg-gray-200 hidden md:inline-block "
            >
              Download CV
            </Link>
          )}
          <div
            className="cursor-pointer lg:hidden"
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              fill="none"
              stroke="currentColor"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="bg-white text-[#212121] rounded-full p-2 transition-colors duration-300 hover:bg-gray-200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3,12H21M9,18H21M3,6H15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          {isMenuOpen && (
            <div className="absolute top-full right-4 mt-2 w-48 bg-black border border-white/15 rounded-lg shadow-lg py-2 z-50">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 py-2 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
