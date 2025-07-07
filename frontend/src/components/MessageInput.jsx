import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Check file size (50MB limit for videos, 10MB for images)
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File size must be less than ${type === "video" ? "50MB" : "10MB"}`
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(type);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: mediaType === "image" ? mediaPreview : null,
        video: mediaType === "video" ? mediaPreview : null,
      });

      // Clear form
      setText("");
      setMediaPreview(null);
      setMediaType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <motion.div
      className="p-4 w-full border-t border-base-300 bg-base-100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {mediaPreview && (
          <motion.div
            className="mb-3 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {mediaType === "image" ? (
                <motion.img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-primary/20 shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.video
                  src={mediaPreview}
                  className="w-20 h-20 object-cover rounded-lg border border-primary/20 shadow-md"
                  controls={false}
                  muted
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <motion.button
                onClick={removeMedia}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-error-content
                flex items-center justify-center shadow-lg"
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="size-3" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <motion.input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:scale-[1.02] transition-transform"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />

          {/* Hidden File Inputs */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, "image")}
          />

          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={videoInputRef}
            onChange={(e) => handleFileChange(e, "video")}
          />

          {/* Media Upload Buttons */}
          <motion.button
            type="button"
            className={`btn btn-circle btn-sm ${
              mediaPreview && mediaType === "image"
                ? "btn-success"
                : "btn-ghost"
            }`}
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image size={18} />
          </motion.button>

          <motion.button
            type="button"
            className={`btn btn-circle btn-sm ${
              mediaPreview && mediaType === "video"
                ? "btn-success"
                : "btn-ghost"
            }`}
            onClick={() => videoInputRef.current?.click()}
            title="Upload Video"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Video size={18} />
          </motion.button>

          <motion.button
            type="submit"
            className="btn btn-primary btn-circle btn-sm"
            disabled={!text.trim() && !mediaPreview}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
export default MessageInput;
