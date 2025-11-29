"use client";

import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaVuejs, FaNodeJs, FaDatabase, FaGitAlt, FaDocker, FaLaptopCode } from "react-icons/fa";
import { useEffect, useState } from "react";
import React from "react";

interface Skill {
    name: string;
    iconName: string;
    icon?: React.ReactElement;
}

const getIconComponent = (iconName: string): React.ReactElement => {
    const iconMap: { [key: string]: React.ReactElement } = {
        'FaHtml5': <FaHtml5 />,
        'FaCss3Alt': <FaCss3Alt />,
        'FaJs': <FaJs />,
        'FaReact': <FaReact />,
        'FaVuejs': <FaVuejs />,
        'FaNodeJs': <FaNodeJs />,
        'FaDatabase': <FaDatabase />,
        'FaGitAlt': <FaGitAlt />,
        'FaDocker': <FaDocker />,
        'FaLaptopCode': <FaLaptopCode />,
    };
    return iconMap[iconName] || <FaLaptopCode />;
};

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch('/api/skills');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch skills');
                }

                if (!Array.isArray(data)) {
                    console.error("API response is not an array:", data);
                    setSkills([]);
                    return;
                }

                // Map icon names to components
                const mappedSkills = data.map((skill: Skill) => ({
                    ...skill,
                    icon: getIconComponent(skill.iconName)
                }));

                setSkills(mappedSkills);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section id="skills" className="py-20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12 relative">
                        <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:block after:w-16 after:h-1 after:bg-primary-gradient after:mx-auto after:mt-2 after:rounded-full">My Tech Stack</h2>
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <p>Loading skills...</p>
                        </div>
                    ) : skills.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-6">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-primary flex items-center gap-3"
                                >
                                    <span className="text-primary text-2xl">{skill.icon}</span>
                                    <span className="font-semibold">{skill.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500">No skills found</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
