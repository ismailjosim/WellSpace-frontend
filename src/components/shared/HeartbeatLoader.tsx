"use client";

import { motion } from "framer-motion";

interface HeartbeatLoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
}

export default function HeartbeatLoader({
  text = "Next Level healthcare...",
  size = "md",
  className = "",
  animated = true,
  showIcon = false,
}: HeartbeatLoaderProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const textSizeClasses = {
    sm: "text-[10px]",
    md: "text-[13.6px]",
    lg: "text-[18px]",
    xl: "text-[24px]",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-screen flex-col items-center justify-center gap-4 ${className}`}
    >
      <motion.svg
        viewBox="0 0 120 120"
        className={sizeClasses[size]}
        role="img"
        aria-label="WellSpace is loading"
      >
        <defs>
          <linearGradient
            id="wellspace-loader-ring"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#00b6a5" />
            <stop offset="100%" stopColor="#ff8a00" />
          </linearGradient>
        </defs>

        <motion.circle
          cx="60"
          cy="60"
          r="53"
          fill="none"
          stroke="url(#wellspace-loader-ring)"
          strokeDasharray="72 16 24 16"
          strokeLinecap="round"
          strokeWidth="3"
          style={{ transformOrigin: "center" }}
          animate={animated ? { rotate: 360 } : undefined}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.circle
          cx="60"
          cy="60"
          r="44"
          fill="#ffffff"
          fillOpacity="0.88"
          stroke="#00a994"
          strokeOpacity="0.18"
          strokeWidth="1"
          animate={animated ? { scale: [0.96, 1.04, 0.96] } : undefined}
          style={{ transformOrigin: "center" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {showIcon ? (
          <motion.path
            d="M20 60h22l8-18 17 38 9-20h24"
            fill="none"
            stroke="#00a994"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
            animate={animated ? { pathLength: [0.2, 1, 0.2] } : undefined}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <motion.image
            href="/wellspace-logo.png"
            x="22"
            y="22"
            width="76"
            height="76"
            preserveAspectRatio="xMidYMid meet"
            animate={animated ? { scale: [0.94, 1.02, 0.94] } : undefined}
            style={{ transformOrigin: "60px 60px" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {animated && (
          <motion.circle
            cx="60"
            cy="7"
            r="3"
            fill="#ff8a00"
            animate={{ opacity: [0.45, 1, 0.45], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.svg>

      {text && (
        <motion.p
          className={`text-center font-medium text-muted-foreground ${textSizeClasses[size]}`}
          initial={animated ? { opacity: 0, y: 10 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
