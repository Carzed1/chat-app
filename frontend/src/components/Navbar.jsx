import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <motion.header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <motion.div
                className="size-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="w-5 h-5 text-primary" />
              </motion.div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ChatFlex
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={"/settings"}
                className="btn btn-sm gap-2 transition-colors hover:bg-primary/10"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </motion.div>

            {authUser && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={"/profile"}
                    className="btn btn-sm gap-2 hover:bg-primary/10"
                  >
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                </motion.div>

                <motion.button
                  className="flex gap-2 items-center btn btn-sm btn-ghost hover:bg-error/10 hover:text-error"
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
export default Navbar;
