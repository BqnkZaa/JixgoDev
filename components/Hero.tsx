"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Facebook, Github, Linkedin, Mail } from "lucide-react";

interface HeroData {
    greeting: string;
    name: string;
    title: string;
    typewriterPhrases: string[];
    buttonText: string;
    githubUrl: string;
    linkedinUrl: string;
    facebookUrl: string;
}

export default function Hero() {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const res = await fetch('/api/hero');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch hero data');
                }

                setHeroData(data);
            } catch (error) {
                console.error("Failed to fetch hero data:", error);
                // Set default values on error
                setHeroData({
                    greeting: "HI ' I AM",
                    name: "Developer",
                    title: "Full Stack Developer",
                    typewriterPhrases: ["Web Applications.", "User Interfaces.", "Clean Code.", "Solutions."],
                    buttonText: "My Project",
                    githubUrl: "#",
                    linkedinUrl: "#",
                    facebookUrl: "#",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    const phrases = heroData?.typewriterPhrases || [];

    useEffect(() => {
        if (!heroData || phrases.length === 0) return;

        const currentPhrase = phrases[phraseIndex];
        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            if (charIndex > 0) {
                timeout = setTimeout(() => {
                    setText(currentPhrase.substring(0, charIndex - 1));
                    setCharIndex((prev) => prev - 1);
                }, 50);
            } else {
                timeout = setTimeout(() => {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }, 500);
            }
        } else {
            if (charIndex < currentPhrase.length) {
                timeout = setTimeout(() => {
                    setText(currentPhrase.substring(0, charIndex + 1));
                    setCharIndex((prev) => prev + 1);
                }, 100);
            } else {
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, 2000);
            }
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, phraseIndex, phrases, heroData]);

    if (loading) {
        return (
            <section
                id="home"
                className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
                style={{ background: "radial-gradient(circle at 50% 50%, #f1f8ff 0%, #ffffff 70%)" }}
            >
                <div className="container mx-auto px-6 text-center">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    if (!heroData) return null;

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
            style={{ background: "radial-gradient(circle at 50% 50%, #f1f8ff 0%, #ffffff 70%)" }}
        >
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4 tracking-widest">
                        {heroData.greeting}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        {heroData.name}<br />
                        <span className="text-gradient text-4xl md:text-6xl">{heroData.title}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 min-h-[1.75rem]">
                        I build <span id="typewriter" className="text-foreground font-semibold">{text}</span>
                        <span className="animate-pulse">|</span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a
                            href="#projects"
                            className="px-8 py-4 bg-primary text-white rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors btn-skew shadow-lg"
                        >
                            {heroData.buttonText} <ArrowRight size={18} />
                        </a>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-6 text-gray-500">
                        {heroData.githubUrl && heroData.githubUrl !== '#' && (
                            <a target="_blank" rel="noopener noreferrer" href={heroData.githubUrl} className="hover:text-primary transition-colors text-2xl">
                                <Github />
                            </a>
                        )}
                        {heroData.linkedinUrl && heroData.linkedinUrl !== '#' && (
                            <a target="_blank" rel="noopener noreferrer" href={heroData.linkedinUrl} className="hover:text-primary transition-colors text-2xl">
                                <Linkedin />
                            </a>
                        )}
                        {heroData.facebookUrl && heroData.facebookUrl !== '#' && (
                            <a target="_blank" rel="noopener noreferrer" href={heroData.facebookUrl} className="hover:text-primary transition-colors text-2xl">
                                <Facebook />
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
