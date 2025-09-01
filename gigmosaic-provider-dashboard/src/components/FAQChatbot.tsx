import React, { useEffect, useState, useRef } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { FaComments, FaTimes, FaPaperPlane, FaRedo } from "react-icons/fa";
import { searchFaqs, FAQ } from "../service/faqService";
import { useMutation } from "@tanstack/react-query";
import chatbotLogo from "../assets/logo-small.png";

interface Message {
  from: "bot" | "user";
  text: string;
  isLoading?: boolean;
  type?: "text" | "question" | "answer";
  faq?: FAQ;
}

const FAQChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi! I'm here to help you with frequently asked questions about Gigmosaic. Type your question below and I'll find the most relevant answers for you.",
      type: "text",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: ({ query }: { query: string }) => searchFaqs(query),
    onSuccess: (data) => {
      setIsSearching(false);
      if (data.faqs && data.faqs.length > 0) {
        // Check if the results are highly relevant
        const isHighlyRelevant = checkRelevance(data.query, data.faqs);

        if (isHighlyRelevant) {
          addMessage({
            from: "bot",
            text: `I found ${data.faqs.length} related question${
              data.faqs.length > 1 ? "s" : ""
            }. Click on any question to see the answer:`,
            type: "text",
          });

          // Add each question as a separate bot message
          data.faqs.forEach((faq) => {
            addMessage({
              from: "bot",
              text: faq.question,
              type: "question",
              faq: faq,
            });
          });
        } else {
          // Show the questions that were found, even if not highly relevant
          addMessage({
            from: "bot",
            text: `I found some related questions, but they might not be exactly what you're looking for. Try one of these:`,
            type: "text",
          });

          // Add each question as a separate bot message
          data.faqs.forEach((faq) => {
            addMessage({
              from: "bot",
              text: faq.question,
              type: "question",
              faq: faq,
            });
          });
        }
      } else {
        // Simple message when no results are found
        addMessage({
          from: "bot",
          text: `I couldn't find any questions related to "${data.query}".`,
          type: "text",
        });
      }
    },
    onError: (error) => {
      setIsSearching(false);
      console.error("Search error:", error);
      addMessage({
        from: "bot",
        text: "Sorry, I'm having trouble searching right now. Please try again in a moment.",
        type: "text",
      });
    },
  });

  // Function to check if search results are highly relevant
  const checkRelevance = (query: string, faqs: FAQ[]): boolean => {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower
      .split(/\s+/)
      .filter((word) => word.length > 2);

    // Check if most FAQs contain the main query words
    const relevantCount = faqs.filter((faq) => {
      const questionLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();

      // Check if at least 50% of query words are found
      const matchingWords = queryWords.filter(
        (word) => questionLower.includes(word) || answerLower.includes(word)
      );

      return matchingWords.length >= Math.ceil(queryWords.length * 0.5);
    }).length;

    return relevantCount >= Math.ceil(faqs.length * 0.7); // 70% should be relevant
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Auto-grow textarea function
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 72); // Max 3 lines (72px)
    element.style.height = `${newHeight}px`;
  };

  const simulateTyping = async (text: string, delay: number = 600) => {
    // Add loading message
    const loadingMessage: Message = {
      from: "bot",
      text: "",
      isLoading: true,
      type: "text",
    };
    addMessage(loadingMessage);

    // Wait for typing animation
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Remove loading message and add actual message
    setMessages((prev) => {
      const newMessages = prev.filter((msg) => !msg.isLoading);
      return [...newMessages, { from: "bot", text, type: "answer" }];
    });
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    // Add user message
    addMessage({ from: "user", text: query, type: "text" });
    setSearchQuery("");
    setIsSearching(true);

    // Reset textarea height to 1 line
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
    }

    // Perform search
    searchMutation.mutate({ query });
  };

  const handleQuestionClick = async (faq: FAQ) => {
    // Add user message showing the question they clicked
    addMessage({ from: "user", text: faq.question, type: "text" });

    // Small delay to make the flow feel natural
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Show typing animation and then the answer
    await simulateTyping(faq.answer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        from: "bot",
        text: "Hi! I'm here to help you with frequently asked questions about Gigmosaic. Type your question below and I'll find the most relevant answers for you.",
        type: "text",
      },
    ]);
    setSearchQuery("");

    // Reset textarea height to 1 line
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
    }
  };

  return (
    <div className="fixed bottom-2 right-4 z-50">
      {/* Chatbot FAB */}
      {!isOpen && (
        <Button
          isIconOnly
          className="w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white hover:bg-teal-600"
          onClick={() => setIsOpen(true)}
        >
          <FaComments size={20} />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] shadow-2xl border-2 border-gray-300 bg-white">
          {/* Header */}
          <div className="bg-white border-b-2 border-gray-200 px-4 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <img
                      src={chatbotLogo}
                      alt="FAQ Assistant"
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Gigmosaic Assistant
                  </div>
                </div>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={16} />
              </Button>
            </div>
          </div>

          <CardBody className="p-0 flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-2 py-1 rounded-2xl ${
                      message.from === "bot"
                        ? message.type === "question"
                          ? "bg-white text-gray-800 shadow-sm border border-gray-300 text-xs"
                          : "bg-gray-100 text-gray-800 shadow-sm text-sm"
                        : "bg-purple-200 text-black text-sm"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    ) : message.type === "question" ? (
                      <button
                        onClick={() =>
                          message.faq && handleQuestionClick(message.faq)
                        }
                        className="text-left w-full hover:bg-gray-50 p-2 rounded transition-colors duration-200 cursor-pointer"
                      >
                        {message.text}
                      </button>
                    ) : (
                      <div className="whitespace-pre-line">{message.text}</div>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Spacer */}
            <div className="h-4 bg-gray-50"></div>

            {/* Input Area */}
            <div className="border-t-2 border-gray-200 p-3 bg-white">
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  title="Start Over"
                >
                  <FaRedo size={14} />
                </Button>
                <textarea
                  ref={inputRef}
                  placeholder="Ask your question"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    adjustTextareaHeight(e.target);
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                  className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={1}
                  style={{
                    minHeight: "40px",
                    maxHeight: "72px",
                    overflowY: "auto",
                    height: "40px",
                  }}
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  <FaPaperPlane size={14} />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default FAQChatbot;
