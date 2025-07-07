import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download, Loader2 } from "lucide-react";

const ImageModal = ({ imageUrl, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log("ImageModal props:", { imageUrl, isOpen, onClose });

  useEffect(() => {
    if (isOpen && imageUrl) {
      setIsLoading(true);
      setHasError(false);

      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl]);
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.png";
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] backdrop-blur-sm"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative max-w-[95vw] max-h-[95vh] p-2 sm:p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Control buttons */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 flex gap-2 z-10">
              <motion.button
                onClick={handleDownload}
                className="bg-white hover:bg-gray-100 text-black p-2 rounded-full transition-colors shadow-lg"
                title="Download image"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              <motion.button
                onClick={onClose}
                className="bg-white hover:bg-gray-100 text-black p-2 rounded-full transition-colors shadow-lg"
                title="Close (Esc)"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            <motion.div
              className="relative"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {isLoading && (
                <motion.div
                  className="flex items-center justify-center bg-gray-100 rounded-lg shadow-2xl min-h-[200px] min-w-[200px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                </motion.div>
              )}

              {hasError && (
                <motion.div
                  className="flex items-center justify-center bg-red-100 rounded-lg shadow-2xl min-h-[200px] min-w-[200px] text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <X className="w-12 h-12 mx-auto mb-2" />
                    <p>Failed to load image</p>
                  </div>
                </motion.div>
              )}

              {!isLoading && !hasError && (
                <motion.img
                  src={imageUrl}
                  alt="Zoomed image"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
              )}

              {!isLoading && !hasError && (
                <motion.div
                  className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black bg-opacity-70 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm backdrop-blur-sm flex items-center gap-1 sm:gap-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    Click outside to close • Press Esc
                  </span>
                  <span className="sm:hidden">Tap outside to close</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
