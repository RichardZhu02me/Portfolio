import { useState } from 'react';
import { ArrowRight, ExternalLink, Github, Network, Layers, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusPing } from "./StatusPing";
import { cn } from "../lib/utils";

const projects = [
    {
        id: "exam-engine",
        title: "Exam Generation Engine",
        description: "Autonomous agent pipeline for generating complex educational content.",
        image: "/projects/project1.png",
        tags: ["LangGraph", "Python", "React", "Map-Reduce"],
        demoURL: "#",
        githubURl: "https://github.com/RichardZhu02me/Exam-Generator",
        caseStudyUrl: "/exam-generator",
    },
    {
        id: "lumen-parser",
        title: "Lumen Parser",
        description: "Advanced RAG system with hierarchical retrieval and late chunking.",
        image: "/projects/project2.png",
        tags: ["ChromaDB", "Transformers", "RRF", "FastAPI"],
        demoURL: "#",
        githubURl: "https://github.com/RichardZhu02me/Lumen-Parser",
        caseStudyUrl: "/lumen-parser",
    },
    {
        id: "epa-consultant",
        title: "WAT.ai x Bindwell Consultant",
        description: "A demo of how AI can be used as a consultant in the pesticide industry.",
        image: "/projects/project1.png",
        tags: ["RAG", "AI Agent", "React", "TailwindCSS", "Python"],
        demoURL: "#",
        githubURl: "https://github.com/rickytang666/epa-consultant",
    },
];

export const ProjectsSection = () => {
    return (
        <section id="projects" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center font-mono">
                    <span className="text-primary/70">&gt;</span> Active <span className="text-primary text-glow">Pipelines</span>
                </h2>
            </div>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-mono text-sm">
                System architecture and autonomous logic deployments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="group bg-card rounded-lg overflow-hidden shadow-xs border border-white/5 transition-all duration-300 hover:border-primary/30 flex flex-col h-full"
                    >
                        {/* Always visible header area */}
                        <div
                            className="p-6 flex flex-col flex-1"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold font-mono tracking-tight text-white/90">{project.title}</h3>
                                    {project.caseStudyUrl && <StatusPing active={true} label="Live" />}
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm mb-4 h-10">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono font-medium rounded-full bg-secondary/80 border border-white/10 text-secondary-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                <div className="flex space-x-3">
                                    <a
                                        href={project.githubURl}
                                        className="text-foreground/60 hover:text-primary transition-colors duration-300"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Github size={18} />
                                    </a>
                                </div>
                                {project.caseStudyUrl && (
                                    <Link to={project.caseStudyUrl} className="text-xs font-mono font-medium px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300 transition-all duration-300 flex items-center gap-1.5 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                        [VIEW_TRACE]
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <a
                    className="cosmic-button w-fit flex items-center mx-auto gap-1"
                    target="_blank"
                    href="https://github.com/RichardZhu02me"
                >
                    Check out My Github {""} <ArrowRight size={16} />
                </a>
            </div>
        </section>
    );
};