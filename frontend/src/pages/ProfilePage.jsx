import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  Shield,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <motion.div
      className="h-screen pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto p-4 py-8">
        <motion.div
          className="bg-base-300 rounded-xl p-6 space-y-8 shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="mt-2 text-base-content/70">
              Your profile information
            </p>
          </motion.div>

          {/* avatar upload section */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative group">
              <motion.img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-primary/20 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <motion.label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary hover:bg-primary/80 text-primary-content
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-lg
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </motion.label>
            </div>
            <motion.p
              className="text-sm text-base-content/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="space-y-1.5 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-base-content/70 flex items-center gap-2 group-hover:text-primary transition-colors">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 group-hover:border-primary/30 transition-colors">
                {authUser?.fullName}
              </p>
            </motion.div>

            <motion.div
              className="space-y-1.5 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-base-content/70 flex items-center gap-2 group-hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 group-hover:border-primary/30 transition-colors">
                {authUser?.email}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-6 bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-6 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <motion.div
                className="flex items-center justify-between py-2 border-b border-base-300/50"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Member Since
                </span>
                <span className="font-medium">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center justify-between py-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Account Status
                </span>
                <span className="text-green-500 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default ProfilePage;
