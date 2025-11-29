"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Github } from "lucide-react";
import { FaLaptopCode, FaMobileAlt, FaChartLine } from "react-icons/fa";
import { useSearch } from "@/contexts/SearchContext";



export default function Projects() {
    const controls = useAnimationControls();
    const [isHovered, setIsHovered] = useState(false);
    const { searchQuery } = useSearch();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch projects');
                }

                if (!Array.isArray(data)) {
                    console.error("API response is not an array:", data);
                    setProjects([]);
                    return;
                }

                // Map icon names to components
                const mappedProjects = data.map((p: any) => ({
                    ...p,
                    icon: getIconComponent(p.iconName)
                }));

                setProjects(mappedProjects);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'FaMobileAlt': return <FaMobileAlt className="text-6xl" />;
            case 'FaChartLine': return <FaChartLine className="text-6xl" />;
            default: return <FaLaptopCode className="text-6xl" />;
        }
    };

    // Filter projects based on search query
    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;

        const query = searchQuery.toLowerCase();
        return projects.filter(project =>
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.tags.some((tag: string) => tag.toLowerCase().includes(query))
        );
    }, [searchQuery, projects]);

    // Duplicate projects to create seamless loop
    const displayProjects = [...filteredProjects];

    useEffect(() => {
        if (loading || displayProjects.length === 0) return;

        const startAnimation = async () => {
            await controls.start({
                x: "-1%",
                transition: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                },
            });
        };

        if (!isHovered) {
            startAnimation();
        } else {
            controls.stop();
        }
    }, [controls, isHovered, loading, displayProjects.length]);

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-secondary/4">
                <div className="container mx-auto px-6 text-center">
                    <p>Loading projects...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-20 bg-secondary/4">
            <div className="container mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="section-title text-center mb-12 relative">
                        <h2 className="text-3xl md:text-4xl inline-block relative after:content-[''] after:block after:w-16 after:h-1 after:bg-primary-gradient after:mx-auto after:mt-2 after:rounded-full">
                            Featured Projects
                        </h2>
                        {searchQuery && (
                            <p className="text-sm text-gray-500 mt-4">
                                พบ {filteredProjects.length} โปรเจค {searchQuery && `สำหรับ "${searchQuery}"`}
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {filteredProjects.length > 0 ? (
                <div
                    className="flex overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.div
                        className="flex gap-8 px-6"
                        animate={controls}
                        initial={{ x: 0 }}
                    >
                        {displayProjects.map((project, index) => (
                            <motion.div
                                key={index}
                                className="w-[350px] h-[450px] flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex-shrink-0 overflow-hidden group cursor-pointer transition-all duration-300"
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                onClick={() => {
                                    if (project.links?.demo && project.links.demo !== '#') {
                                        window.open(project.links.demo, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                            >
                                {/* Image/Icon Area */}
                                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 overflow-hidden">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback to icon if image fails to load
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = project.icon;
                                            }}
                                        />
                                    ) : (
                                        project.icon
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">ไม่พบโปรเจคที่ตรงกับคำค้นหา "{searchQuery}"</p>
                </div>
            )}
        </section>
    );
}
