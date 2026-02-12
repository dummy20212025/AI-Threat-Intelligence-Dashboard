"use client";
import { motion, AnimatePresence } from "framer-motion";

export const MDiv = motion.div;
export const MH3 = motion.h3;
export const APresence = AnimatePresence;

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};