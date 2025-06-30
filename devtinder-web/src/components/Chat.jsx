import { useParams } from "react-router-dom";
import { useEffect, useState , useRef } from 'react';
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket';
import { BASE_URL } from "../utils/constants";
import axios from 'axios';


const Chat = () => {
  const {targetUserId} = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const bottomRef = useRef(null);

  const fetchChatMessages = async () => {
    try{
      const res = await axios.get(BASE_URL + '/chat'+ `/${targetUserId}`, {withCredentials: true});
      console.log(res.data.chat.messages);

      const chatMessages = res.data.chat.messages.map((msg) => ({
        text: msg.text,
        firstName: msg.senderId.firstName,
      }));
      setMessages(chatMessages);
    }
    catch(error) {
      console.error("Error fetching chat messages:", error);
    }
  }

  useEffect(() => {
    fetchChatMessages();
  } , []);

  useEffect(() => {
    const socket = createSocketConnection();
    if(!userId) return;
    socket.emit('joinChat', { firstName: user?.firstName , userId , targetUserId});

    socket.on('messageReceived', ({ firstName , text }) => {
      console.log(firstName + " " + text);
      setMessages((messages) => [...messages , {text, firstName}]);
      setNewMsg('');
    });

    return () => {
      socket.disconnect();
    }
  }, [userId , targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const socket = createSocketConnection();

    socket.emit('sendMessage', {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMsg,
    });
  };

    return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto border rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gray-700 text-white px-4 py-3 text-lg font-semibold">
          Chat
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 space-y-4 bg-grey-150">
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.firstName === user.firstName;
            return (
              <div
                key={idx}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-header flex items-center gap-2">
                  <span className="font-medium text-sm sm:text-base">{msg.firstName}</span>
                  <time className="text-xs opacity-50 whitespace-nowrap">2 hours ago</time>
                </div>
                <div
                  className={`chat-bubble break-words max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
                    isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer text-xs opacity-50">{isOwnMessage ? "You" : "Seen"}</div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row gap-2 border-t bg-white">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none text-sm sm:text-base text-gray-700"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
export default Chat;