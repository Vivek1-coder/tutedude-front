"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Suspense } from "react";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { EmptyChatPlaceholder } from "../../components/EmptyChatPlaceholder";
import {
  ChatGear,
  UploadCloud,
  Activity,
  DeleteIcon,
  Trash,
} from "lucide-react";
import {
  Send,
  Bot,
  User,
  Heart,
  Brain,
  Thermometer,
  Weight,
} from "lucide-react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const quickSymptoms = [
  {
    icon: Heart,
    label: "Heart Palpitations",
    prompt:
      "I am experiencing heart palpitations and saw a video saying it’s normal. Should I be concerned?",
  },
  { icon: Brain, label: "Headache", prompt: "I have a persistent headache" },
  {
    icon: Thermometer,
    label: "Fever",
    prompt: "I have a fever and feel unwell",
  },
  {
    icon: Weight,
    label: "Weight Loss study",
    prompt:
      "Investigate sudden weight loss without lifestyle changes. (Doctor – Differential Analysis)",
  },
];

const Chat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  async function GenerateNewSession() {
    const res = await axios.post("/api/chat/new-session");
    console.log(res);
    params.set("chatId", res.data.chatId);
    router.replace(`${pathname}?${params.toString()}`);
    setMessages([]);
    // return res.data;
  }
  const [oldChats, setOldChats] = useState([]);
  async function loadOldChat(id) {
    console.log("gay", id);
    const res = await axios.post(`/api/chat/load-chat`, { id }, {});
    console.log(res.data);
    let data = res.data.messages;
    data = data.map((obj) => {
      if (obj.role === "user") return obj;

      let content = obj.content;
      content = JSON.parse(content);
      content = `Answer: ${content.answer}\n\nExplaination: ${content.explaination}`;
      obj.content = content;
      return obj;
    });
    setMessages(data);
    params.set("chatId", res.data._id);
    router.replace(`${pathname}?${params.toString()}`);

    console.log(res);
  }

  const deleteChat = async (chatId) => {
    try {
      const response = await axios.delete("/api/chat/delete-chat", {
        data: { chatId }, // axios uses `data` for DELETE body
      });

      setOldChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== chatId)
      );
    } catch (error) {
      console.error(
        "Failed to delete chat:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    // define your async function inside
    const loadPrevChats = async () => {
      try {
        const res = await axios.post("/api/chat/load-prev-chats", {});
        setOldChats(res.data);
        if (res.data.length > 0) {
          console.log(res.data);
          const temp_initial_id = res.data[0]._id;
          // console.log(temp_initial_id);
          // params.set("chatId", temp_initial_id);
          // router.replace(`${pathname}?${params.toString()}`);
          console.log("intially load , loading chat_id", temp_initial_id);
          loadOldChat(temp_initial_id);
        } else {
          GenerateNewSession();
        }

        console.log(res);
      } catch (err) {
        console.error("Failed to load previous chats:", err);
      }
    };

    loadPrevChats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    //     setTimeout(() => {

    //       setMessages((prev) => [...prev, aiMessage]);
    //       setIsLoading(false);
    //     }, 2000);

    const chatId = searchParams.get("chatId");
    if (!chatId) {
      return;
    }
    console.log(chatId);
    const res = await axios.post("/api/chat/query", {
      query: messageContent,
      chatId,
    });
    console.log(res);
    const { answer, explaination } = res.data.response;
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: `Answer: ${answer}\n\nExplaination: ${explaination}`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);

    console.log(res);
  };

  const handleQuickSymptom = (prompt) => {
    handleSend(prompt);
  };
  // useEffect(() => {
  //   setMessages([
  //     {
  //       id: "1",
  //       content:
  //         "Hello! I'm your EthicalMD assistant. How can I help you today? Please describe your symptoms or health concerns.",
  //       sender: "ai",
  //       timestamp: new Date(), // Now safe: runs only on client
  //     },
  //   ]);
  // }, []);

  return (
    <div className="min-h-screen pt-16 flex bg-[#f0f3f4] dark:bg-gray-900 h-screen">
      {/* <EmptyChatPlaceholder></EmptyChatPlaceholder> */}
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div>
          <Button
            onClick={() => GenerateNewSession()}
            className="w-full cursor-pointer "
          >
            + New Conversation
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-[#293241] dark:text-white mb-4 mt-4">
          Previous Chats
        </h2>

        <div className="space-y-2">
          {oldChats?.map((oldChat) => (
            <Card
              key={oldChat._id}
              className="flex items-center justify-between w-full p-2 mb-2 border rounded-md shadow-sm hover:bg-gray-100"
            >
              <div
                className="flex-1 cursor-pointer text-left truncate"
                onClick={() => loadOldChat(oldChat._id)}
              >
                {oldChat?.title || "Untitled Chat"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteChat(oldChat._id)}
                className="text-red-500 hover:text-red-700 hover:bg-gray-200 cursor-pointer"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.length === 0 && <EmptyChatPlaceholder />}
          {messages?.length > 0 &&
            messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "user" || message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-[#006d77] text-white ml-2 mr-2"
                        : "bg-[#f28482] text-white p-2 mr-2"
                    }`}
                  >
                    {message.role === "user" || message.sender == "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-8 h-8" />
                    )}
                  </div>
                  <Card
                    className={`p-3 ${
                      message.sender === "user"
                        ? "bg-[#006d77] text-white"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-white/70"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {/* {message?.timestamp?.toLocaleTimeString()} */}
                    </p>
                  </Card>
                </div>
              </motion.div>
            ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f28482] text-white mr-2 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="p-3 bg-white dark:bg-gray-800">
                  <div className="flex space-x-1">
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
                </Card>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your symptoms..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="bg-[#006d77] hover:bg-[#006d77]/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat />
    </Suspense>
  );
}
