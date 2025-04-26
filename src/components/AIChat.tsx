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

  const topics = [
    {
      title: "Cravings",
      response:
        "Cravings are a normal part of recovery. Try these strategies:\n1. Distract yourself with a hobby or exercise\n2. Practice deep breathing\n3. Call a support person\n4. Remember your reasons for staying sober",
    },
    {
      title: "Relapse Prevention",
      response:
        "Here are some key strategies for preventing relapse:\n1. Identify your triggers\n2. Develop healthy coping mechanisms\n3. Build a strong support network\n4. Practice self-care regularly\n5. Stay connected with your recovery community",
    },
    {
      title: "Stress Management",
      response:
        "Managing stress is crucial in recovery. Consider:\n1. Regular exercise\n2. Meditation or mindfulness\n3. Talking to a therapist\n4. Joining a support group\n5. Practicing deep breathing exercises",
    },
    {
      title: "Support Resources",
      response:
        "There are many support options available:\n1. AA meetings\n2. SMART Recovery\n3. Online support groups\n4. Professional counseling\n5. Sober living communities",
    },
  ];

  const handleNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm here to support you on your journey to sobriety. How can I help you today?",
      },
    ]);
  };

  const handleTopicClick = async (topic: {
    title: string;
    response: string;
  }) => {
    const userMessage: Message = {
      role: "user",
      content: `Tell me about ${topic.title}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: topic.response },
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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          AI Support Assistant
        </h2>
        <button
          onClick={handleNewConversation}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          New Conversation
        </button>
      </div>
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
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Quick Topics:
        </h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => handleTopicClick(topic)}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition"
            >
              {topic.title}
            </button>
          ))}
        </div>
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
