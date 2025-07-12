import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      set({ isSendingMessage: true });

      // Check if it's a large file upload (has video or large image)
      const hasLargeMedia =
        messageData.video ||
        (messageData.image && messageData.image.length > 3000000); // ~2.2MB base64

      const config = hasLargeMedia
        ? {
            timeout: 300000, // 5 minutes for large files (reduced from 10 minutes)
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log("Upload progress:", percentCompleted + "%");

              // Show progress for very large uploads
              if (progressEvent.total > 10000000) {
                // 10MB+
                toast.loading(`Uploading... ${percentCompleted}%`, {
                  id: "upload-progress",
                });
              }
            },
          }
        : { timeout: 30000 }; // 30 seconds for regular messages

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
        config
      );
      set({ messages: [...messages, res.data] });

      // Dismiss any progress toasts on success
      toast.dismiss("upload-progress");
    } catch (error) {
      // Dismiss any progress toasts on error
      toast.dismiss("upload-progress");

      // Log the error for debugging but don't show user-facing error messages
      // Let MessageInput handle the user-facing error messages
      console.error("Send message error:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });

      throw error; // Re-throw so MessageInput can handle it
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
