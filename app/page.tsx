import Navbar from "@/components/layout/Navbar";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Achievements from "@/components/sections/Achievements";
import Footer from "@/components/sections/Footer";
import Contact from "@/components/sections/Contact";

export default function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <Experience />
                <Skills />
                <Education />
                <Achievements />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
