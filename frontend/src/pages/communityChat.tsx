import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { apiEndpoint, getSocketUrl } from "@/lib/api-config";

interface Community {
  _id: string;
  name: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface CommunityChatComponentProps {
  community: Community;
  username: string;
}

const CommunityChatComponent: React.FC<CommunityChatComponentProps> = ({ 
  community, 
  username 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    const newSocket = io(getSocketUrl(), {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.emit("joinRoom", community._id);

    newSocket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch previous messages
    fetch(apiEndpoint(`/bee/message/${community._id}`), {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        return res.json();
      })
      .then((data) => setMessages(data.reverse() || []))
      .catch((err) => {
        console.error("Message fetch error:", err);
        setError(err.message);
      });

    return () => {
      newSocket.emit("leaveRoom", community._id);
      newSocket.disconnect();
    };
  }, [community._id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    const messageData = {
      communityId: community._id,
      message: { 
        sender: username, 
        content: trimmedMessage, 
        timestamp: new Date() 
      },
    };

    // Emit socket event
    socket?.emit("sendMessage", messageData);

    // Send message to backend
    fetch(apiEndpoint("/bee/message/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        communityId: community._id, 
        content: trimmedMessage 
      }),
    })
    .catch((err) => {
      console.error("Message send error:", err);
      setError("Failed to send message");
    });

    setNewMessage("");
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-black rounded-lg border border-gray-800 mx-auto">
      {/* Chat Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">{community.name} Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto py-6 px-4 md:px-8 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[90%] p-4 rounded-lg shadow-md
                ${msg.sender === username 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-white'}
              `}
            >
              <div className="text-sm mb-1 font-semibold">
                {msg.sender === username ? 'You' : msg.sender}
              </div>
              <div className="text-base">{msg.content}</div>
              <div className="text-xs mt-2 opacity-70 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage} 
        className="p-4 md:px-8 border-t border-gray-800 flex items-center space-x-4"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 text-white focus:ring-red-500"
          placeholder="Type a message..."
        />
        <button 
          type="submit" 
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommunityChatComponent;