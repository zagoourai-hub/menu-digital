"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, type Variants } from "motion/react";

type FadeUpListProps = {
    children: ReactNode;
    className?: string;
    once?: boolean;
};

const containerVariants: Variants = {
    hidden: {},
    visible: {},
};

const itemVariants: Variants = {
    hidden: (index: number) => ({
        opacity: 0,
        x:  -100,
        y: 0,
        filter: "blur(6px)",
        transition: {
            duration: 0.5,
            delay: index * 0.3,
            ease: "easeInOut",
        },
    }),

    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        y: [-50, 0],
        filter: "blur(0px)",
        transition: {
            duration: 0.85,
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
    exit: (index: number) => ({
        opacity: 0,
        x: 100,
        y: 0,
        filter: "blur(6px)",
        transition: {
            duration: 1.2,
            delay: index * 0.3,
            ease: "easeInOut",
        },
    }),
};



export function FadeUpList({
    children,
    className,
    once = false,
}: FadeUpListProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

    const isInView = useInView(ref, {
        once,
        amount: 0.5,
        margin: "-15% 0px -15% 0px",
    });

    useEffect(() => {
        if (isInView) {
            setHasEntered(true);
        }
    }, [isInView]);

    const animationState = isInView
        ? "visible"
        : hasEntered
            ? "exit"
            : "hidden";


    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={animationState}
            className={className}
        >
            {Children.map(children, (child, index) => (
                <motion.div
                    custom={index}
                    variants={itemVariants}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}