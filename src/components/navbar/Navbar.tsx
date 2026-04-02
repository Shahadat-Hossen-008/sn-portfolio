"use client";
import Image from "next/image";
import logo from "@/../public/personalLogo.png";
import Link from "next/link";
import { useState } from "react";
import HamburgerMenu from "../../../public/icons/HamburgerMenu";
import CrossIcon from "../../../public/icons/CrossIcon";

export default function Navbar({ cvUrl }: { cvUrl: string | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 lg:py-8 fixed left-0 right-0 top-0 z-100">
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
            {!isMenuOpen ? <HamburgerMenu /> : <CrossIcon />}
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
