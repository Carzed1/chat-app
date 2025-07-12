import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Video, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaFile, setMediaFile] = useState(null); // Store the actual file for size info
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

    // Check file size with more conservative limits
    // Base64 encoding increases size by ~33%, plus we need buffer for other data
    // For 10MB+ videos to work reliably, we need to be more conservative
    const maxSize = type === "video" ? 12 * 1024 * 1024 : 8 * 1024 * 1024; // 12MB for video, 8MB for images
    if (file.size > maxSize) {
      toast.error(
        `File size must be less than ${
          type === "video" ? "12MB" : "8MB"
        }. Current size: ${formatFileSize(
          file.size
        )}. Large files may fail to upload due to network limitations.`
      );
      return;
    }

    // Warn for files approaching the limit
    const warningSize = type === "video" ? 8 * 1024 * 1024 : 5 * 1024 * 1024; // 8MB for video, 5MB for images
    if (file.size > warningSize) {
      toast(
        `Large ${type} file (${formatFileSize(
          file.size
        )}) - upload may take longer and could fail on slower connections.`,
        {
          duration: 5000,
          icon: "⚠️",
        }
      );
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(type);
      setMediaFile(file); // Store file for size info

      // Show warning for large files
      if (file.size > 5 * 1024 * 1024) {
        // 5MB threshold
        toast.warning(
          `Large ${type} selected (${formatFileSize(
            file.size
          )}). Upload may take longer.`,
          { duration: 4000 }
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    setMediaFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;

    // Prevent multiple rapid submissions
    if (isSendingMessage) return;

    // Store media info before clearing
    const hasMedia = !!mediaPreview;
    const mediaTypeName = mediaType === "image" ? "image" : "video";

    // Clean up any existing upload toasts
    toast.dismiss("upload-media");
    toast.dismiss("upload-progress");
    toast.dismiss("upload-error");

    try {
      // Show toast for media uploads
      if (hasMedia) {
        const fileSize = mediaFile?.size || 0;
        const isLargeFile = fileSize > 5 * 1024 * 1024; // 5MB threshold

        if (isLargeFile) {
          toast.loading(
            `Uploading large ${mediaTypeName} (${formatFileSize(
              fileSize
            )})... This may take a while.`,
            {
              id: "upload-media",
              duration: 0, // Don't auto-dismiss for large files
            }
          );
        } else {
          toast.loading(`Uploading ${mediaTypeName}...`, {
            id: "upload-media",
          });
        }
      }

      // Log the request size for debugging
      const requestData = {
        text: text.trim(),
        image: mediaType === "image" ? mediaPreview : null,
        video: mediaType === "video" ? mediaPreview : null,
      };

      if (hasMedia) {
        const encodedSize = mediaPreview ? mediaPreview.length : 0;
        console.log(`Sending ${mediaTypeName}:`, {
          originalSize: formatFileSize(mediaFile?.size || 0),
          encodedSize: formatFileSize(encodedSize),
          ratio: encodedSize / (mediaFile?.size || 1),
        });

        // Additional check for encoded size - be more conservative
        if (encodedSize > 35 * 1024 * 1024) {
          // 35MB encoded limit (reduced from 50MB)
          toast.error(
            `Encoded file too large (${formatFileSize(
              encodedSize
            )}). Please compress your ${mediaTypeName} or choose a smaller file. Recommended: under 8MB for videos.`,
            { id: "upload-media", duration: 8000 }
          );
          return;
        }

        // Warn about large encoded files
        if (encodedSize > 20 * 1024 * 1024) {
          // 20MB encoded warning
          toast(
            `Large encoded file (${formatFileSize(
              encodedSize
            )}) - upload may fail on slower connections. Consider compressing the file.`,
            {
              duration: 6000,
              icon: "⚠️",
            }
          );
        }
      }

      await sendMessage(requestData);

      // Clear form
      setText("");
      setMediaPreview(null);
      setMediaType(null);
      setMediaFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";

      // Success toast for media - dismiss all upload-related toasts first
      if (hasMedia) {
        toast.dismiss("upload-media");
        toast.dismiss("upload-progress");
        toast.success(
          `${
            mediaTypeName.charAt(0).toUpperCase() + mediaTypeName.slice(1)
          } sent successfully!`,
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      if (hasMedia) {
        // Dismiss all upload-related toasts first
        toast.dismiss("upload-media");
        toast.dismiss("upload-progress");
        toast.dismiss("upload-error"); // Dismiss any previous error toasts

        // Determine the specific error message
        let errorMessage = `Failed to send ${mediaTypeName} (${formatFileSize(
          mediaFile?.size || 0
        )})`;

        if (
          error.code === "ECONNABORTED" ||
          error.message?.includes("timeout")
        ) {
          errorMessage = `Upload timeout. Your ${mediaTypeName} (${formatFileSize(
            mediaFile?.size || 0
          )}) is too large or connection is slow. Try a smaller file.`;
        } else if (error.code === "ERR_NETWORK") {
          errorMessage = `Network error while uploading ${mediaTypeName} (${formatFileSize(
            mediaFile?.size || 0
          )}). Check your internet connection or try a smaller file.`;
        } else if (error.response?.status === 413) {
          errorMessage = `File too large for server. Your ${mediaTypeName} (${formatFileSize(
            mediaFile?.size || 0
          )}) exceeds server limits. Try a file under 8MB.`;
        } else if (error.response?.status === 400) {
          errorMessage = `Invalid file. Server rejected your ${mediaTypeName}. ${
            error.response?.data?.message || "Try a different file format."
          }`;
        }

        // Show only one error message with a unique ID
        toast.error(errorMessage, {
          id: "upload-error",
          duration: 8000,
        });
      }
    }
  };

  return (
    <motion.div
      className="p-4 w-full border-t border-base-300 bg-base-100"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {mediaPreview && (
          <motion.div
            className="mb-3 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              {mediaType === "image" ? (
                <motion.img
                  src={mediaPreview}
                  alt="Preview"
                  className={`w-20 h-20 object-cover rounded-lg border border-primary/20 shadow-md transition-opacity ${
                    isSendingMessage ? "opacity-50" : ""
                  }`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                />
              ) : (
                <motion.video
                  src={mediaPreview}
                  className={`w-20 h-20 object-cover rounded-lg border border-primary/20 shadow-md transition-opacity ${
                    isSendingMessage ? "opacity-50" : ""
                  }`}
                  controls={false}
                  muted
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                />
              )}

              {/* File size indicator */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-b-lg">
                {formatFileSize(mediaFile?.size || 0)}
              </div>

              {isSendingMessage && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </motion.div>
              )}
              {!isSendingMessage && (
                <motion.button
                  onClick={removeMedia}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-error-content
                  flex items-center justify-center shadow-lg"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="size-3" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <motion.input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:scale-[1.01] transition-transform"
            placeholder={isSendingMessage ? "Sending..." : "Type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingMessage}
            whileFocus={{ scale: isSendingMessage ? 1 : 1.01 }}
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
            title="Upload Image (Max 8MB recommended)"
            disabled={isSendingMessage}
            whileHover={{ scale: isSendingMessage ? 1 : 1.05 }}
            whileTap={{ scale: isSendingMessage ? 1 : 0.95 }}
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
            title="Upload Video (Max 8MB recommended for reliable uploads)"
            disabled={isSendingMessage}
            whileHover={{ scale: isSendingMessage ? 1 : 1.05 }}
            whileTap={{ scale: isSendingMessage ? 1 : 0.95 }}
          >
            <Video size={18} />
          </motion.button>

          <motion.button
            type="submit"
            className="btn btn-primary btn-circle btn-sm"
            disabled={(!text.trim() && !mediaPreview) || isSendingMessage}
            whileHover={{ scale: isSendingMessage ? 1 : 1.05 }}
            whileTap={{ scale: isSendingMessage ? 1 : 0.95 }}
          >
            {isSendingMessage ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
export default MessageInput;
