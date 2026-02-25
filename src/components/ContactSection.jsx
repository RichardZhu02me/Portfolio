import { Instagram, Linkedin, Mail, Map, Phone, Send, Youtube } from "lucide-react";
import { cn } from "@/lib/utils"
import { toast, Zoom } from 'react-toastify';
import { useState } from "react";

export const ContactSection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleSubmit = (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        setTimeout(() => {
            toast.error('Sorry, this feature is currently unavailable. Send me an email instead!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: isDarkMode ? "dark" : "light",
                transition: Zoom,
            });
            setIsSubmitting(false);
        }, 1500);
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
                                        href="mailto:richardzhu09@gmail.com" target="_blank"
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
                    <div className="bg-card p-8 rounded-lg shadow-xs" onSubmit={handleSubmit}>
                        <h3 className="text-2l font-semibold mb-6"> Send a Message</h3>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2"> {" "}Your Name</label>
                                <input type="text" id="name" name="name" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary"
                                    placeholder="Richard Zhu..."
                                />

                                <label htmlFor="email" className="block text-sm font-medium mb-2"> {" "}Email</label>
                                <input type="text" id="email" email="email" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary"
                                    placeholder="RichardZhu09@gmail.com"
                                />

                                <label htmlFor="message" className="block text-sm font-medium mb-2"> {" "}Your Message</label>
                                <textarea id="message" name="message" required
                                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outlined-hidden focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Hello, I'd like to talk about..."
                                />
                            </div>

                            <button type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "cosmic-button w-full flex items-center justify-center gap-2",

                                )}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                                <Send size={16} />
                            </button>

                        </form>
                    </div>
                </div>

            </div>

        </section>
    );
};