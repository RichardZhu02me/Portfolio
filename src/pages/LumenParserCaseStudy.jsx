import { ArrowLeft, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeProvider, useTheme } from "../components/ThemeContext";
import GlitchcoreBackground from "../components/GlitchcoreBackground";
import BubbleBackground from "../components/BubbleBackground";
import { Footer } from "../components/Footer";
import { ThemeToggle } from "../components/ThemeToggle";

const CaseStudyContent = () => {
    const { isDarkMode } = useTheme();

    return (
        <>
            {/* <ThemeToggle /> */}

            <BubbleBackground
                bubbleCount={23}
                minSize={20}
                maxSize={80}
                animationDuration={{ min: 15, max: 25 }}
                className={isDarkMode ? "opacity-0" : "opacity-75"}
            />

            {isDarkMode && (
                <GlitchcoreBackground
                    intensity="normal"
                    colors={{
                        bgDark: '#0a0210',
                        neon1: '#ff2d95',
                        neon2: '#6efff6',
                        neon3: '#8b5cff',
                        opacities: { noise: 0.06, scanline: 0.06, silhouette: 0.12 }
                    }}
                    className="opacity-80"
                />
            )}

            <main className="container mx-auto max-w-4xl px-4 py-24 relative z-10">
                <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Portfolio
                </Link>

                <div className="space-y-12">
                    <header className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["ChromaDB", "Transformers", "Qwen", "Jina"].map((tag, i) => (
                                <span key={i} className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Lumen Parser</h1>
                        <p className="text-xl text-muted-foreground">Engineered a highly sophisticated hierarchical retrieval pipeline optimized to minimize noise while maximizing contextual expansion using Late Chunking.</p>

                        <div className="flex gap-4 pt-4">
                            <a href="https://github.com/RichardZhu02me/lumen-parser" target="_blank" rel="noreferrer" className="cosmic-button flex items-center gap-2">
                                <Github size={18} /> View Repository
                            </a>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto xl:max-w-none">

                        {/* Late Chunking Section */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-md shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-md h-full">
                                <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>

                                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between relative z-10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">late_chunking_logic.sh</span>
                                </div>
                                <div className="p-6 relative z-10 font-mono text-sm">
                                    <h2 className="text-xl font-bold mb-4 text-emerald-400">&gt; SEMANTIC_FIDELITY</h2>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        Standard naive chunking (e.g., recursive character splitting) destroys long-range dependencies across token boundaries.
                                        In Lumen Parser, I implemented <span className="text-emerald-300">Late Chunking (Jina v3)</span> via a custom ChromaDB embedding function.
                                    </p>
                                    <div className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-md text-slate-400 text-xs leading-relaxed">
                                        This ensures that the global document context is preserved at the embedding model layer <em>before</em> vector pooling occurs. The result is a dramatically richer embedding space where individual chunks retain the semantic metadata of their surrounding neighbors.
                                    </div>
                                    <div className="mt-6 border-t border-slate-800 pt-4">
                                        <h3 className="text-[10px] font-bold text-slate-500 mb-2">// OUTCOME</h3>
                                        <p className="text-emerald-400/80 font-bold uppercase tracking-wider text-xs">
                                            Eliminated the "lost in the middle" retrieval problem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
                            <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>
                            <img src="/projects/lumen_chunking.png" alt="Late Chunking Architecture" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity z-10 p-2" />
                        </div>

                        {/* Hybrid Retrieval Section */}
                        <div className="flex items-center justify-center rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative order-last lg:order-none">
                            <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>
                            <img src="/projects/lumen_rrf.png" alt="Hybrid Retrieval Architecture" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity z-10 p-2" />
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-md shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-md h-full">
                                <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>

                                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between relative z-10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">hybrid_retrieval_rrf.sh</span>
                                </div>
                                <div className="p-6 relative z-10 font-mono text-sm flex flex-col h-full">
                                    <h2 className="text-xl font-bold mb-4 text-emerald-400">&gt; SIGNAL_VS_NOISE</h2>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        Beyond the absolute capability of the embedding layer, the retrieval pipeline solves the classic "Signal vs. Noise" database problem through two key architectural decisions:
                                    </p>
                                    <ul className="list-none space-y-4 text-slate-400 mt-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500">[*]</span>
                                            <span><strong className="text-slate-200">Hierarchical Parsing:</strong> Utilized child-leaf retrieval to pinpoint exact answers while retaining the ability to trigger parent-node expansion for broader context.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500">[*]</span>
                                            <span><strong className="text-slate-200">Reciprocal Rank Fusion (RRF):</strong> Implemented hybrid search combining dense embeddings with sparse BM25S retrieval, mathematically fused via RRF to guarantee high-precision keyword retention.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export const LumenParserCaseStudy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <ThemeProvider>
                <CaseStudyContent />
            </ThemeProvider>
        </div>
    );
};
