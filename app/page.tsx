"use client";

import { SearchProvider } from "@/contexts/SearchContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "@/components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <SearchProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </SearchProvider>
  );
}
