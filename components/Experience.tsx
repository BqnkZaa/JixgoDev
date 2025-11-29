"use client";

import { motion } from "framer-motion";

const experiences = [
    {
        role: "Senior Frontend Developer",
        company: "Tech Corp",
        period: "2022 - Present",
        description: "Leading the frontend team, architecting scalable React applications, and improving site performance by 40%."
    },
    {
        role: "Full Stack Developer",
        company: "StartUp Inc",
        period: "2020 - 2022",
        description: "Built and maintained multiple web applications using Next.js and Node.js. Implemented CI/CD pipelines."
    },
    {
        role: "Junior Developer",
        company: "Web Solutions",
        period: "2018 - 2020",
        description: "Collaborated with designers to implement responsive UI components. Assisted in backend API development."
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-20 bg-white dark:bg-black">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        My professional journey and the companies I've had the privilege to work with.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800 pb-8 last:pb-0"
                        >
                            <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-black" />
                            <h3 className="text-xl font-bold">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span className="font-medium text-foreground">{exp.company}</span>
                                <span>•</span>
                                <span>{exp.period}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                {exp.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
