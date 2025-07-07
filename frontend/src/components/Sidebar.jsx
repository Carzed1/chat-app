import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const searchedUsers = filteredUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <motion.aside
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="border-b border-base-300 w-full p-5"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Users className="size-6 text-primary" />
          </motion.div>
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:block mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="input input-bordered w-full pl-10 input-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm flex items-center gap-1">
              <Filter className="size-3" />
              Show online only
            </span>
          </label>
          <motion.span
            className="text-xs text-base-content/70 px-2 py-1 bg-primary/10 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {onlineUsers.length - 1} online
          </motion.span>
        </div>
      </motion.div>

      <div className="overflow-y-auto w-full py-3">
        <AnimatePresence>
          {searchedUsers.map((user, index) => (
            <motion.button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-primary/50"
                    : ""
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative mx-auto lg:mx-0">
                <motion.img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                {onlineUsers.includes(user._id) && (
                  <motion.span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                  </motion.span>
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-base-content/70 flex items-center gap-1">
                  {onlineUsers.includes(user._id) ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Online
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      Offline
                    </>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {searchedUsers.length === 0 && (
          <motion.div
            className="text-center text-base-content/70 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {searchQuery ? (
              <div className="space-y-2">
                <Search className="size-8 mx-auto text-base-content/40" />
                <p>No users found matching &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Users className="size-8 mx-auto text-base-content/40" />
                <p>No online users</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};
export default Sidebar;
