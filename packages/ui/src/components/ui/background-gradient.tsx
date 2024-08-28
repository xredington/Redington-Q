"use client";
import { cn } from "../../lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative p-[0px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-40 group-hover:opacity-80 blur-lg transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,rgba(0,77,64,0.6),transparent),radial-gradient(circle_farthest-side_at_100%_0,rgba(0,191,165,0.6),transparent),radial-gradient(circle_farthest-side_at_100%_100%,rgba(27,94,32,0.6),transparent),radial-gradient(circle_farthest-side_at_0_0,rgba(76,175,80,0.6),rgba(46,125,50,0.6))]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,rgba(0,77,64,0.6),transparent),radial-gradient(circle_farthest-side_at_100%_0,rgba(0,191,165,0.6),transparent),radial-gradient(circle_farthest-side_at_100%_100%,rgba(27,94,32,0.6),transparent),radial-gradient(circle_farthest-side_at_0_0,rgba(76,175,80,0.6),rgba(46,125,50,0.6))]"
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
