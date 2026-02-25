// import { ThemeToggle } from "../components/ThemeToggle";
// import GlitchcoreBackground from "../components/GlitchcoreBackground";
import BubbleBackground from "../components/BubbleBackground";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection"
import { AboutSection } from "../components/AboutSection"
import { SkillsSection } from "../components/SkillsSection"
import { ProjectsSection } from "../components/ProjectsSection"
import { ContactSection } from "../components/ContactSection"
import { ThemeProvider, useTheme } from "../components/ThemeContext";
import { Footer } from "../components/Footer";

const HomeContent = () => {
    const { isDarkMode } = useTheme();



    return (
        <>
            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}





            {/* Background Effects - Always render both, control visibility */}

            {/* BubbleBackground - always running, visible only in light mode */}
            <BubbleBackground
                bubbleCount={23}
                minSize={20}
                maxSize={80}
                animationDuration={{ min: 15, max: 25 }}
                className={isDarkMode ? "opacity-0" : "opacity-75"}
            />

            {/* GlitchcoreBackground - only render in dark mode */}
            {isDarkMode && (
                <GlitchcoreBackground
                    intensity="normal"
                    colors={{
                        bgDark: '#0a0210',
                        neon1: '#ff2d95',
                        neon2: '#6efff6',
                        neon3: '#8b5cff',
                        opacities: {
                            noise: 0.06,
                            scanline: 0.06,
                            silhouette: 0.12
                        }
                    }}
                    className="opacity-80"
                />
            )}

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
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <ThemeProvider>
                <HomeContent />
            </ThemeProvider>
        </div>
    );
};