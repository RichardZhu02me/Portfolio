import { Briefcase, Code, User } from "lucide-react";

const pdfURL = "/Richard_Zhu_Software_Engineer.pdf";

function handleClick() {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = "Richard_Zhu_Software_Engineer.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            {" "}
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary"> Me </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3> Multifaceted Backend and AI Engineer</h3>

                        <p className="text-muted-foreground">
                            I'm a developer passionate about building intelligent systems—from backend infrastructure to AI-powered agents—that solve meaningful problems.
                        </p>

                        <p className="text-muted-foreground">

                        </p>

                        <div className="flex flex-ol sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                {" "}
                                Get In Touch
                            </a>
                            <button onClick={handleClick} className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 cursor-pointer">
                                Download CV
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg"> Software Engineering </h4>
                                    <p className="text-muted-foreground">
                                        I design and implement robust software systems across a wide range of applications—from automation tools to data-driven platforms—focusing on performance, maintainability, and user experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg"> AI Infrastructure </h4>
                                    <p className="text-muted-foreground">
                                        I build the scalable "plumbing" that makes AI work in production, including custom vector similarity pipelines, RAG data ingestion engines, and high-throughput Model APIs.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg"> AI Engineering </h4>
                                    <p className="text-muted-foreground">
                                        I develop intelligent AI agents by leveraging advanced prompt engineering, reasoning strategies, and modern orchestration tools to solve real-world problems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};