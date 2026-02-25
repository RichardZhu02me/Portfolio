import { ArrowLeft, ExternalLink, Github } from "lucide-react";
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
                            {["LangGraph", "FastAPI", "Pinecone", "GenAI"].map((tag, i) => (
                                <span key={i} className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Exam Generation Engine</h1>
                        <p className="text-xl text-muted-foreground">Architected a multi-agent generation pipeline using LangGraph to parallelize the creation of problems, solutions, and grading rubrics.</p>

                        <div className="flex gap-4 pt-4">
                            <a href="https://github.com/RichardZhu02me/exam-generator" target="_blank" rel="noreferrer" className="cosmic-button flex items-center gap-2">
                                <Github size={18} /> View Repository
                            </a>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto xl:max-w-none">

                        {/* Map Reduce Architecture Section */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-md shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-md h-full">
                                <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>

                                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between relative z-10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">architecture_overview.sh</span>
                                </div>
                                <div className="p-6 relative z-10 font-mono text-sm">
                                    <h2 className="text-xl font-bold mb-4 text-emerald-400">&gt; MAP_REDUCE_EXECUTION</h2>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        The core challenge was orchestrating multiple LLM calls reliably without massive latency spikes.
                                        By implementing a <span className="text-emerald-300">Map-Reduce pattern via LangGraph</span>, I was able to decouple the generation stages.
                                    </p>
                                    <ul className="list-none space-y-4 text-slate-400 mt-6">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500">[*]</span>
                                            <span><strong className="text-slate-200">Graph State Routing:</strong> Managed complex, conditional workflows across multiple autonomous agents.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500">[*]</span>
                                            <span><strong className="text-slate-200">Parallelization:</strong> Problems, solutions, and highly-detailed rubrics are generated concurrently rather than sequentially.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500">[*]</span>
                                            <span><strong className="text-slate-200">Agentic RAG:</strong> Integrated Pinecone dense indices to ground generation strictly in the provided syllabus and structural academic materials.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
                            <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>
                            <img src="/projects/exam_map_reduce.png" alt="Map-Reduce Architecture" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity z-10 p-2" />
                        </div>

                        {/* Streaming Infrastructure Section */}
                        <div className="flex items-center justify-center rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative order-last lg:order-none">
                            <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>
                            <img src="/projects/exam_streaming.png" alt="Real-Time Streaming Infrastructure" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity z-10 p-2" />
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
                                    <span className="text-xs font-mono text-slate-500">streaming_infrastructure.sh</span>
                                </div>
                                <div className="p-6 relative z-10 font-mono text-sm flex flex-col h-full">
                                    <h2 className="text-xl font-bold mb-4 text-emerald-400">&gt; REAL_TIME_STREAMING</h2>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        To ensure a massive reduction in perceived latency (TTFB), I engineered a real-time Markdown/LaTeX streaming layer using <span className="text-emerald-300">FastAPI</span>.
                                    </p>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        Rather than waiting for the entire LangGraph execution to complete, agent intermediate states and partial token streams are routed via Server-Sent Events (SSE) directly to the React/Vite frontend for dynamic document assembly.
                                        This required meticulous handling of chunked responses and complex LaTeX structural parsing on the fly.
                                    </p>
                                    <div className="mt-auto border-t border-slate-800 pt-4">
                                        <h3 className="text-[10px] font-bold text-slate-500 mb-2">// BUSINESS_VALUE</h3>
                                        <p className="text-slate-400 text-xs">
                                            This system transforms raw syllabi and disorganized course notes into production-ready academic assessments in seconds. By leveraging deterministic state machines instead of naive prompting, hallucination rates drop to near-zero.
                                        </p>
                                    </div>
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

export const ExamGeneratorCaseStudy = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <ThemeProvider>
                <CaseStudyContent />
            </ThemeProvider>
        </div>
    );
};
