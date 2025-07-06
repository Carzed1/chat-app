import { useEffect } from "react";
import { X } from "lucide-react";

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-[95vw] max-h-[95vh] p-4">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-black p-2 rounded-full transition-colors z-10 shadow-lg"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative">
          <img
            src={imageUrl}
            alt="Zoomed image"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
            Click to zoom • Press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
