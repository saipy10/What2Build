"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.25, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
  useInView = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  useInView?: boolean;
} & HTMLMotionProps<"div">) {
  const animationProps = useInView
    ? {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount: "some" as const },
      }
    : {
        initial: "hidden",
        animate: "show",
      };

  return (
    <motion.div
      {...animationProps}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

