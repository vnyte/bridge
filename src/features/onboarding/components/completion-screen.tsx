'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { School, Settings, Sparkles } from 'lucide-react';

type CompletionScreenProps = {
  onComplete: () => void;
};

const stages = [
  {
    icon: School,
    text: 'Saving your branches',
    duration: 2000,
  },
  {
    icon: Settings,
    text: 'Getting your app ready',
    duration: 2000,
  },
  {
    icon: Sparkles,
    text: 'Almost there',
    duration: 1500,
  },
];

export const CompletionScreen = ({ onComplete }: CompletionScreenProps) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let totalTime = 0;

    stages.forEach((stage, index) => {
      const timer = setTimeout(() => {
        setCurrentStage(index);
      }, totalTime);
      timers.push(timer);
      totalTime += stage.duration;
    });

    const finalTimer = setTimeout(() => {
      onComplete();
    }, totalTime);
    timers.push(finalTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-16">
        {/* Left side - illustration placeholder */}
        <motion.div
          className="w-64 h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.p
            className="text-muted-foreground text-sm relative z-10 font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.8,
              type: 'spring',
              stiffness: 200,
            }}
          >
            Illustration placeholder
          </motion.p>
        </motion.div>

        {/* Right side - stages */}
        <motion.div
          className="w-80"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          <motion.h1
            className="text-2xl font-semibold text-foreground mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.7,
              duration: 0.6,
              ease: 'easeOut',
            }}
          >
            Hang tight! We&apos;re getting everything ready
          </motion.h1>

          <div className="relative">
            {stages.map((stage, index) => {
              const IconComponent = stage.icon;
              const isActive = index === currentStage;
              const isCompleted = index < currentStage;
              const isLast = index === stages.length - 1;

              return (
                <div key={index} className="relative">
                  {/* Connecting line */}
                  {!isLast && (
                    <motion.div
                      className="absolute left-5 top-10 w-0.5 h-12 bg-gradient-to-b from-primary to-border"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isCompleted ? 48 : 0,
                        opacity: isCompleted ? 1 : 0.3,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                        delay: isCompleted ? 0.3 : 0,
                      }}
                    />
                  )}

                  <motion.div
                    className="flex items-center gap-4 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.9 + index * 0.2,
                      duration: 0.5,
                      ease: 'easeOut',
                    }}
                  >
                    <div className="relative">
                      <motion.div
                        className={`h-10 w-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                          isActive
                            ? 'bg-primary border-primary shadow-primary/20'
                            : isCompleted
                              ? 'bg-primary border-primary'
                              : 'bg-background border-border'
                        }`}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                          boxShadow: isActive
                            ? '0 0 20px rgba(var(--primary-rgb), 0.3)'
                            : '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                        }}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/40"
                            animate={{
                              scale: [1, 1.4],
                              opacity: [0.8, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeOut',
                            }}
                          />
                        )}
                        <motion.div
                          animate={{
                            rotate: isCompleted && !isActive ? 0 : isActive ? 360 : 0,
                          }}
                          transition={{
                            duration: isActive ? 2 : 0.5,
                            repeat: isActive ? Infinity : 0,
                            ease: isActive ? 'linear' : 'easeOut',
                          }}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${
                              isActive || isCompleted
                                ? 'text-primary-foreground'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </motion.div>
                      </motion.div>
                    </div>

                    <motion.p
                      className={`font-medium text-lg ${
                        isActive
                          ? 'text-foreground'
                          : isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      }`}
                      animate={{
                        x: isActive ? [0, 3, 0] : 0,
                        opacity: isActive ? 1 : isCompleted ? 0.9 : 0.6,
                      }}
                      transition={{
                        x: { duration: 3, repeat: isActive ? Infinity : 0, ease: 'easeInOut' },
                        opacity: { duration: 0.3 },
                      }}
                    >
                      {stage.text}
                    </motion.p>
                  </motion.div>

                  {!isLast && <div className="h-6" />}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
