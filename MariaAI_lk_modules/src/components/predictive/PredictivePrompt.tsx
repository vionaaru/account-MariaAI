import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PredictivePromptProps {
  predictedAction: string | null;
}

export function PredictivePrompt({ predictedAction }: PredictivePromptProps) {
  if (!predictedAction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-4 bg-emerald-400/10 border border-emerald-400/20 p-4 rounded-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <span className="font-medium">Suggested Action</span>
      </div>
      <p className="text-sm text-slate-300 mb-3">
        {predictedAction === 'morning_report' && "Would you like to see today's morning report?"}
        {predictedAction === 'performance_check' && "Time for your afternoon performance review?"}
        {predictedAction === 'daily_summary' && "Ready to generate your daily summary?"}
      </p>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 bg-emerald-400 text-slate-900 rounded-lg text-sm hover:bg-emerald-500 transition-colors">
          Yes, proceed
        </button>
        <button className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-sm hover:bg-slate-700 transition-colors">
          Maybe later
        </button>
      </div>
    </motion.div>
  );
}