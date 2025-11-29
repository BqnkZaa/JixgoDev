"use client";

import { motion } from "framer-motion";
import { User, Download } from "lucide-react";
import { useEffect, useState } from "react";

interface AboutData {
    sectionTitle: string;
    heading: string;
    description: string;
    profileImageUrl: string;
    cvLinkText: string;
    cvUrl: string;
}

export default function About() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch('/api/about');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch about data');
                }

                setAboutData(data);
            } catch (error) {
                console.error("Failed to fetch about data:", error);
                // Set default values
                setAboutData({
                    sectionTitle: "About Me",
                    heading: "About Me",
                    description: "Welcome to my portfolio!",
                    profileImageUrl: "/profile.png",
                    cvLinkText: "Download CV",
                    cvUrl: "#",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <section id="about" className="about">
                <div className="container mx-auto px-6">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    if (!aboutData) return null;

    return (
        <section id="about" className="about">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="section-title">{aboutData.sectionTitle}</div>
                    <div className="about-grid">
                        <div className="about-img">
                            <img
                                src={aboutData.profileImageUrl}
                                alt="Profile Picture"
                            />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-4">{aboutData.heading}</h3>
                            <p style={{ marginTop: '1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                                {aboutData.description}
                            </p>

                            <div style={{ marginTop: '2rem' }}>
                                <a
                                    href={aboutData.cvUrl}
                                    style={{ color: 'var(--primary-color)', fontWeight: 600 }}
                                    className="inline-flex items-center gap-2 hover:underline transition-all"
                                >
                                    {aboutData.cvLinkText} <Download size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
