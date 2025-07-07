import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <motion.div
      className="h-screen container mx-auto px-4 pt-20 max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-8">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            Theme Settings
          </h2>
          <p className="text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {THEMES.map((t, index) => (
            <motion.button
              key={t}
              className={`
                group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                ${
                  theme === t
                    ? "bg-primary/10 border-2 border-primary shadow-lg"
                    : "hover:bg-base-200/50 border-2 border-transparent"
                }
              `}
              onClick={() => setTheme(t)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <div
                className="relative h-10 w-full rounded-md overflow-hidden shadow-md"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
                {theme === t && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-md flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center group-hover:text-primary transition-colors">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            Preview
          </h3>
          <motion.div
            className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 bg-gradient-to-br from-base-200 to-base-300">
              <div className="max-w-lg mx-auto">
                {/* Mock Chat UI */}
                <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        J
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-sm">John Doe</h3>
                        <p className="text-xs text-base-content/70 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Online
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                    {PREVIEW_MESSAGES.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${
                          message.isSent ? "justify-end" : "justify-start"
                        }`}
                        initial={{ opacity: 0, x: message.isSent ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.2 }}
                      >
                        <motion.div
                          className={`
                            max-w-[80%] rounded-xl p-3 shadow-md
                            ${
                              message.isSent
                                ? "bg-primary text-primary-content"
                                : "bg-base-200"
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.1 }}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`
                              text-[10px] mt-1.5
                              ${
                                message.isSent
                                  ? "text-primary-content/70"
                                  : "text-base-content/70"
                              }
                            `}
                          >
                            12:00 PM
                          </p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-300 bg-gradient-to-r from-base-100 to-base-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10 focus:scale-[1.02] transition-transform"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <motion.button
                        className="btn btn-primary h-10 min-h-0 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default SettingsPage;
