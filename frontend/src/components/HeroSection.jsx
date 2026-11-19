import { ArrowDown, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

export const HeroSection = () => {
    const [text, setText] = useState("");
    const fullText = "System: Architecting autonomous self-correction states and fault-tolerant AI pipelines.";

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center px-4"
        >
            <div className="container max-w-4xl mx-auto z-10 w-full">
                <div className="space-y-6 flex flex-col items-center">
                    {/* Terminal window effect */}
                    <div className="w-full max-w-3xl bg-black/80 border border-primary/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm opacity-0 animate-fade-in">
                        <div className="bg-secondary/40 px-4 py-2 flex items-center gap-2 border-b border-primary/20">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="flex-1 text-center flex justify-center items-center gap-2 text-xs text-muted-foreground font-mono">
                                <Terminal size={12} />
                                <span>agentic_core.sh</span>
                            </div>
                        </div>
                        <div className="p-6 md:p-8 min-h-[160px] flex items-center justify-start">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-mono text-left leading-relaxed">
                                <span className="text-primary/70 font-bold mr-2">root@architect:~#</span>
                                <span className="text-green-400">
                                    {text}
                                </span>
                                <span className="inline-block w-2.5 h-[1.2em] bg-primary ml-1 align-middle animate-pulse"></span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="pt-12 opacity-0 animate-fade-in-delay-4 flex justify-center">
                    <a href="#projects" className="cosmic-button flex items-center gap-2">
                        Initialize Trace <ArrowDown size={16} className="animate-bounce" />
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce opacity-0 animate-fade-in-delay-4">
                <span className="text-sm font-mono text-muted-foreground mb-2"> [ scroll deeper ] </span>
            </div>
        </section>
    );
};