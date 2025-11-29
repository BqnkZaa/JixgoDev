"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Auto scroll to projects when typing
        if (e.target.value) {
            const projectsSection = document.getElementById("projects");
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass py-4 px-[5%]">
            <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <a href="#" className="text-2xl font-bold tracking-tighter whitespace-nowrap">
                    <span className="text-gradient">&lt;JIXGODEV /&gt;</span>
                </a>

                {/* Search Bar (Desktop - Center) */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium relative hover:text-primary transition-colors after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-5px] after:left-0 after:bg-primary after:transition-all hover:after:w-full whitespace-nowrap"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full left-0 right-0 glass border-b border-gray-100 dark:border-gray-800 p-6 md:hidden flex flex-col gap-4 shadow-lg"
                >
                    {/* Search Bar (Mobile) */}
                    <div className="relative w-full mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                    </div>

                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}
