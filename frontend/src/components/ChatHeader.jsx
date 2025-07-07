import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <motion.div
      className="p-6 border-b border-base-300/50 bg-gradient-to-r from-base-100 via-base-200 to-base-100 backdrop-blur-sm relative overflow-hidden"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <motion.div 
            className="avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="size-14 rounded-full relative">
              <motion.img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="rounded-full border-3 border-primary/20 shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              {isOnline && (
                <motion.span
                  className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full ring-3 ring-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* User info */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.h3 
              className="font-bold text-xl bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {selectedUser.fullName}
            </motion.h3>
            <motion.p 
              className="text-sm flex items-center gap-2 mt-1"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isOnline ? (
                <motion.span
                  className="flex items-center gap-2 text-green-600 font-medium"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.span 
                    className="w-2 h-2 bg-green-500 rounded-full shadow-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Active now
                </motion.span>
              ) : (
                <motion.span
                  className="flex items-center gap-2 text-base-content/60"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  Offline
                </motion.span>
              )}
            </motion.p>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Close button */}
          <motion.button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle btn-sm hover:bg-error/10 hover:text-error transition-all duration-200 shadow-md hover:shadow-lg"
            title="Close Chat"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <X className="size-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default ChatHeader;
