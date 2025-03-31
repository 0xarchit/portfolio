import { motion } from 'framer-motion';

export const Blob = () => {
  return (
    // Hide blob on small devices
    <div className="block absolute top-0 right-0 w-[800px] h-[600px] -z-0 opacity-50">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 10, 0],
          rotateX: [0, 15, 0],
          rotateY: [0, -15, 0],
          y: [0, -20, 0],
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%", 
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 bg-gradient-to-r from-[#00ffc3] via-[#64FFDA] to-[#000000]"
      />
    </div>
  );
};