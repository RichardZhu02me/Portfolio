import BubbleBackground from "../components/BubbleBackground";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection"
import { AboutSection } from "../components/AboutSection"
import { SkillsSection } from "../components/SkillsSection"
import { ProjectsSection } from "../components/ProjectsSection"
import { ContactSection } from "../components/ContactSection"
import { Footer } from "../components/Footer";

const HomeContent = () => {


    return (
        <>
            {/* Background Effects - Always render both, control visibility */}

            {/* BubbleBackground - always running, visible only in light mode */}
            <BubbleBackground
                bubbleCount={40}
                minSize={15}
                maxSize={60}
                baseSpeed={0.5}
                className="opacity-75"
            />

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main>
                <HeroSection />
                <AboutSection />
                <ProjectsSection />
                <SkillsSection />
                <ContactSection />
            </main>

            {/* Footer */}
            <Footer />
        </>
    );
};

export const Home = () => {
    return (
        <HomeContent />
    );
};