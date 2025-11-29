"use client";

import { motion } from "framer-motion";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

interface ContactInfo {
    sectionTitle: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    facebookName: string;
    facebookUrl: string;
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await fetch('/api/contact-info');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch contact info');
                }

                setContactInfo(data);
            } catch (error) {
                console.error("Failed to fetch contact info:", error);
                // Set default values
                setContactInfo({
                    sectionTitle: "Get In Touch",
                    subtitle: "Have a project in mind or just want to say hi? I'd love to hear from you.",
                    email: "",
                    phone: "",
                    location: "",
                    facebookName: "",
                    facebookUrl: "#",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: "a5bf4ebd-2703-4ebd-bd80-eb9b8914b586", // ⚠️ ต้องใส่ Access Key จาก web3forms.com
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New Contact from ${formData.name}`,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 5000);
            }
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading || !contactInfo) {
        return (
            <section id="contact" className="py-20 bg-gray-50 dark:bg-zinc-100">
                <div className="container mx-auto px-6">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-20 bg-gray-50 dark:bg-zinc-100">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{contactInfo.sectionTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {contactInfo.subtitle}
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:w-1/2 space-y-8"
                    >
                        {contactInfo.email && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-lg shadow-sm">
                                    <Mail className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.email}</p>
                                </div>
                            </div>
                        )}

                        {contactInfo.phone && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-lg shadow-sm">
                                    <Phone className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.phone}</p>
                                </div>
                            </div>
                        )}

                        {contactInfo.location && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white dark:bg-black rounded-lg shadow-sm">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Location</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.location}</p>
                                </div>
                            </div>
                        )}

                        {contactInfo.facebookUrl && contactInfo.facebookUrl !== '#' && (
                            <a target="_blank" rel="noopener noreferrer" href={contactInfo.facebookUrl}>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white dark:bg-black rounded-lg shadow-sm">
                                        <Facebook className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Facebook</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{contactInfo.facebookName}</p>
                                    </div>
                                </div>
                            </a>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:w-1/2 bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black focus:ring-0 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black focus:ring-0 transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border-transparent focus:border-primary focus:bg-white dark:focus:bg-black focus:ring-0 transition-colors"
                                    placeholder="How can I help you?"
                                />
                            </div>

                            {/* Status Messages */}
                            {status === "success" && (
                                <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm">
                                    ✓ ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็ว
                                </div>
                            )}
                            {status === "error" && (
                                <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                                    ✗ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? "กำลังส่ง..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
