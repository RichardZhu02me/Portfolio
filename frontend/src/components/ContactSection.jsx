import { Instagram, Linkedin, Mail, Map, Phone, Send, Youtube } from "lucide-react";

const contactEmail = "richardzhu09@gmail.com";

export const ContactSection = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        const subject = encodeURIComponent(`Portfolio message from ${fields.get("name")}`);
        const body = encodeURIComponent(`${fields.get("message")}\n\nReply to: ${fields.get("email")}`);
        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    };

    return (
        <section id="contact" className="py-24 px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Get In <span className="text-primary"> Touch </span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? Feel free to reach out.
                    I'm always open to discussing new opportunities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-semibold mb-6">
                            Contact Information
                        </h3>

                        <div className="space-y-6 justify-center">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Phone className="h-6 w-6 text-primary" /> {" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Phone</h4>
                                    <a
                                        href="tel:+14375224079" target="_blank"
                                        className="text-muted-foregound hover:text-primary transition-colors"
                                    >
                                        +1 (437) 522-4079
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Mail className="h-6 w-6 text-primary" /> {" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Email</h4>
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="text-muted-foregound hover:text-primary transition-colors"
                                    >
                                        RichardZhu09@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Map className="h-6 w-6 text-primary" /> {" "}
                                </div>
                                <div>
                                    <h4 className="font-medium"> Location</h4>
                                    <a
                                        href="https://www.google.com/maps/place/Markham,+ON" target="_blank"
                                        className="text-muted-foregound hover:text-primary transition-colors"
                                    >
                                        Markham, ON, Canada
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="pt-8">
                            <h4>
                                Connect With Me
                            </h4>
                            <div className="flex space-x-4 justify-center">
                                <a href="https://www.linkedin.com/in/richard-zhu-472853263/" target="_blank">
                                    <Linkedin />
                                </a>
                                <a href="https://www.instagram.com/zertume/" target="_blank">
                                    <Instagram />
                                </a>
                                <a href="https://www.youtube.com/@Zertume" target="_blank">
                                    <Youtube />
                                </a>
                            </div>



                        </div>

                    </div>
                    <div className="bg-card p-8 rounded-lg shadow-xs">
                        <h3 className="text-2l font-semibold mb-6"> Send a Message</h3>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2"> {" "}Your Name</label>
                                <input type="text" id="name" name="name" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary"
                                    placeholder="Richard Zhu..."
                                />

                                <label htmlFor="email" className="block text-sm font-medium mb-2"> {" "}Email</label>
                                <input type="email" id="email" name="email" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary"
                                    placeholder="RichardZhu09@gmail.com"
                                />

                                <label htmlFor="message" className="block text-sm font-medium mb-2"> {" "}Your Message</label>
                                <textarea id="message" name="message" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Hello, I'd like to talk about..."
                                />
                            </div>

                            <button type="submit" className="cosmic-button w-full flex items-center justify-center gap-2">
                                Open email draft
                                <Send size={16} />
                            </button>

                        </form>
                    </div>
                </div>

            </div>

        </section>
    );
};