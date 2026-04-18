
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What is the total revenue reported?",
  "Compare year-over-year performance",
  "What are the main expense categories?",
  "Summarize the cash flow statement",
];

export function ChatInterface({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
      };
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, message: content.trim() }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No stream reader");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder
            .decode(value)
            .split("\n")
            .filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const { text } = JSON.parse(data);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + text }
                    : m
                )
              );
            } catch {}
          }
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again." }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [documentId, isLoading]
  );

  return (
    <div className="flex flex-col h-[500px]">
      {/* Suggested questions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-4 py-2 text-sm rounded-full border border-zinc-700
                text-zinc-300 hover:border-amber-500 hover:text-amber-500
                transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto space-y-3 mb-4 p-4
          bg-zinc-900 rounded-xl border border-zinc-800"
      >
        {messages.length === 0 && (
          <p className="text-center text-zinc-500 pt-20">
            Ask anything about your document...
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${
                  msg.role === "user"
                    ? "bg-amber-600 text-zinc-950 rounded-br-sm"
                    : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                }`}
            >
              {msg.content ? (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              ) : (
                <span className="flex items-center gap-2 text-zinc-400">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask a question about your document..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700
            text-zinc-200 text-sm focus:outline-none focus:border-amber-500
            placeholder:text-zinc-500 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-amber-600 text-zinc-950 font-semibold
            text-sm disabled:opacity-40 hover:bg-amber-500 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}