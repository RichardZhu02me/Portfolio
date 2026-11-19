import { useState } from 'react';
import { StatusPing } from './StatusPing';
const openingMessage = { role: "bot", content: "Hello! How can I assist you today?" };
const unavailableMessage = "Chat is temporarily unavailable.";

export const ChatbotWidget = () => {
    const apiUrl = import.meta.env.VITE_GCLOUD_RUN_URL?.trim();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([openingMessage]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const toggleChat = () => setIsOpen((open) => !open);

    const sendMessage = async (event) => {
        event.preventDefault();
        const question = input.trim();
        if (!apiUrl || !question || isSending) return;

        setMessages((previous) => [...previous, { role: "user", content: question }]);
        setInput("");
        setIsSending(true);
        let answer = unavailableMessage;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: question }),
            });
            if (response.ok) {
                const data = await response.json();
                if (typeof data?.response === "string" && data.response.trim()) {
                    answer = data.response;
                }
            }
        } catch {
            answer = unavailableMessage;
        } finally {
            setMessages((previous) => [...previous, { role: "bot", content: answer }]);
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999]">
            {isOpen ? (
                <div className="w-[min(450px,calc(100vw-2rem))] h-[min(550px,calc(100dvh-2rem))] bg-slate-950 border border-slate-800 rounded-md shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-md">
                    <div className="absolute inset-0 bg-[url('linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)')] bg-[size:20px_20px] pointer-events-none"></div>

                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-semibold text-emerald-500 tracking-wider">REASONING_TERMINAL</span>
                            <StatusPing active={Boolean(apiUrl)} label="Configured" />
                        </div>
                        <button
                            onClick={toggleChat}
                            className="text-slate-400 hover:text-white transition-colors flex items-center justify-center w-6 h-6 rounded hover:bg-slate-800 font-mono text-xs"
                            aria-label="Close"
                        >
                            [X]
                        </button>
                    </div>
                    <div role="log" className="flex-1 p-4 overflow-y-auto bg-transparent text-sm space-y-3 font-mono relative z-10">
                        {!apiUrl && <p role="status">{unavailableMessage}</p>}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`inline-block px-3 py-2 rounded-sm max-w-[85%] break-words border text-xs shadow-sm ${msg.role === "user"
                                            ? "bg-slate-800/80 border-slate-700 text-slate-300 ml-auto"
                                            : "bg-black/60 border-emerald-500/30 text-emerald-400 mr-auto shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                                        }`}
                                >
                                    <span className="opacity-50 mr-2">{msg.role === "user" ? ">_" : "SYS>"}</span>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="flex p-3 border-t border-slate-800 bg-slate-900 gap-2 relative z-10">
                        <span className="text-emerald-500 flex items-center font-mono opacity-70 border-r border-slate-700 pr-2 mr-1">~</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            aria-label="Chat message"
                            disabled={!apiUrl || isSending}
                            className="min-w-0 flex-1 px-2 py-1 bg-transparent border-none text-slate-200 font-mono text-sm focus:outline-none focus:ring-0 placeholder:text-slate-600"
                            placeholder="Execute command..."
                        />
                        <button
                            type="submit"
                            disabled={!apiUrl || isSending || !input.trim()}
                            className="text-xs font-mono uppercase tracking-wider text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 px-3 py-1 rounded transition-colors"
                        >
                            {isSending ? "Sending…" : "[EXEC]"}
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={toggleChat}
                    aria-label="Open chatbot"
                    className="cosmic-button w-full flex items-center justify-center"
                >
                    💬
                </button>
            )}
        </div>
    );
};
