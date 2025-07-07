import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ImageModal from "./ImageModal";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    console.log("Image clicked:", imageUrl);
    console.log("Current selectedImage:", selectedImage);
    console.log("Current isImageModalOpen:", isImageModalOpen);
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
    console.log("After setting state - should be true");
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <motion.div
        className="flex-1 flex flex-col overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="chat-image avatar"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="size-10 rounded-full border-2 border-primary/20">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="rounded-full"
                  />
                </div>
              </motion.div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <motion.div
                className="chat-bubble flex flex-col"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {message.image && (
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer shadow-lg transition-shadow hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                      
                        handleImageClick(message.image);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* Zoom overlay hint */}
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        className="bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
                        initial={{ scale: 0.8, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                        Click to zoom
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
                {message.video && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.video
                      src={message.video}
                      controls
                      className="sm:max-w-[200px] rounded-md mb-2 shadow-lg"
                      preload="metadata"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      Your browser does not support the video tag.
                    </motion.video>
                  </motion.div>
                )}
                {message.text && <p>{message.text}</p>}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <MessageInput />

      {/* Test button for debugging */}
     

      {/* Image Modal */}
      <ImageModal
        imageUrl={selectedImage}
        isOpen={isImageModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};
export default ChatContainer;
