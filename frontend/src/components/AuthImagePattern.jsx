import { motion } from "framer-motion";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <motion.div
      className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-12"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="max-w-md text-center">
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className={`aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6 + i * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "hsl(var(--p) / 0.3)",
              }}
            />
          ))}
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-base-content/60 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AuthImagePattern;
