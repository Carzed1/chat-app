import { MessageSquare, Users, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NoChatSelected = () => {
  return (
    <motion.div
      className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <motion.div
          className="flex justify-center gap-4 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center
             justify-center backdrop-blur-sm border border-primary/20"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </motion.div>

            {/* Floating mini icons */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center"
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Users className="w-3 h-3 text-secondary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Welcome to ChatFlex!
          </h2>
          <p className="text-base-content/60 text-lg">
            Select a conversation from the sidebar to start chatting
          </p>
        </motion.div>

        {/* Helpful hint */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-base-content/50 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose a contact to get started</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NoChatSelected;
