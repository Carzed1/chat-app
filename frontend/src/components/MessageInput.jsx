import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Video } from "lucide-react";
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
    if (type === 'image' && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    if (type === 'video' && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Check file size (50MB limit for videos, 10MB for images)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${type === 'video' ? '50MB' : '10MB'}`);
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
        image: mediaType === 'image' ? mediaPreview : null,
        video: mediaType === 'video' ? mediaPreview : null,
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
    <div className="p-4 w-full">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === 'image' ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <video
                src={mediaPreview}
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                controls={false}
                muted
              />
            )}
            <button
              onClick={removeMedia}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* Image File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, 'image')}
          />
          
          {/* Video File Input */}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={videoInputRef}
            onChange={(e) => handleFileChange(e, 'video')}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className={`flex btn btn-circle
                     ${mediaPreview && mediaType === 'image' ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <Image size={20} />
          </button>
          
          {/* Video Upload Button */}
          <button
            type="button"
            className={`flex btn btn-circle
                     ${mediaPreview && mediaType === 'video' ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => videoInputRef.current?.click()}
            title="Upload Video"
          >
            <Video size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !mediaPreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
