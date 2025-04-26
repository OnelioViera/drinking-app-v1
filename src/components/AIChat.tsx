"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm here to support you on your journey to sobriety. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real implementation, this would call an AI API
      // For now, we'll simulate a response
      const response = await simulateAIResponse(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // This is a placeholder function that simulates AI responses
  // In a real implementation, this would be replaced with an actual AI API call
  const simulateAIResponse = async (input: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("craving")) {
      return "Cravings are a normal part of recovery. Try these strategies:\n1. Distract yourself with a hobby or exercise\n2. Practice deep breathing\n3. Call a support person\n4. Remember your reasons for staying sober";
    } else if (lowerInput.includes("relapse")) {
      return "Relapse is not a failure, but a part of the recovery journey. What's important is that you're here now. Would you like to talk about what led to the relapse and how we can prevent it in the future?";
    } else if (
      lowerInput.includes("anxiety") ||
      lowerInput.includes("stress")
    ) {
      return "Managing anxiety and stress is crucial in recovery. Consider:\n1. Regular exercise\n2. Meditation or mindfulness\n3. Talking to a therapist\n4. Joining a support group";
    } else if (lowerInput.includes("support")) {
      return "There are many support options available:\n1. AA meetings\n2. SMART Recovery\n3. Online support groups\n4. Professional counseling\nWould you like more information about any of these?";
    } else {
      return "I understand you're going through a challenging time. Remember that recovery is a journey, and it's okay to have difficult moments. Would you like to talk more about what you're experiencing?";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        AI Support Assistant
      </h2>
      <div className="h-[200px] overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user" ? "bg-blue-100 ml-4" : "bg-gray-100 mr-4"
            }`}
          >
            <p className="text-gray-800 whitespace-pre-line">
              {message.content}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
