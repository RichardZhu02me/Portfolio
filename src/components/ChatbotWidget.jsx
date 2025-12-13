import { useState } from 'react';
const apiUrl = import.meta.env.VITE_GCLOUD_RUN_URL;
const idToken = import.meta.env.VITE_GLCOUD_ID_TOKEN;

export const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name: input }),
            });
            const data = await response.json();
            console.log(data);
            const botMessage = { role: "bot", content: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.log(error),
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Sorry, something went wrong." },
            ]);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            {isOpen ? (
                <div className="w-[400px] h-[480px] bg-card border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
                    <div className="bg-primary/30 px-4 py-4 flex items-center justify-between rounded-t-xl">
                        <span className="text-lg font-semibold text-primary-foreground">Chatbot</span>
                        <button
                            onClick={toggleChat}
                            className="rounded-full cosmic-button flex items-center justify-center w-8 h-8 p-0"
                            aria-label="Close"
                        >
                            X
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-background/50 text-base space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <span
                                    className={`inline-block px-4 py-2 rounded-lg max-w-[80%] break-words ${
                                        msg.role === "user"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-foreground"
                                    }`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex p-4 border-t border-border bg-card gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ask something..."
                        />
                        <button
                            onClick={sendMessage}
                            className="cosmic-button flex items-center justify-center"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={toggleChat}
                    className="cosmic-button w-full flex items-center justify-center"
                >
                    💬
                </button>
            )}
        </div>
    );
};