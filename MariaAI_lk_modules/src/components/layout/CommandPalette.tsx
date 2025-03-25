import React from 'react';
import { motion } from 'framer-motion';
import {
  Command,
  Brain,
  MessageSquare,
  UserPlus,
  Workflow,
  FileText,
  GitBranch,
  Clock,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  showCommandPalette: boolean;
  predictedAction: string | null;
  userPreferences: {
    commonActions: string[];
  };
}

export function CommandPalette({ 
  showCommandPalette, 
  predictedAction,
  userPreferences 
}: CommandPaletteProps) {
  if (!showCommandPalette) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] z-50"
    >
      <div className="w-[640px] bg-slate-800 rounded-xl shadow-2xl">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-700/50 rounded-lg">
            <Command className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search commands..."
              className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs bg-slate-700 rounded text-slate-400">ESC</kbd>
          </div>
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {predictedAction && (
            <div className="px-4 py-2 mb-2">
              <span className="text-xs text-emerald-400 font-medium">SUGGESTED</span>
              <button className="w-full flex items-center justify-between px-4 py-3 mt-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>
                    {predictedAction === 'morning_report' && "Generate Morning Report"}
                    {predictedAction === 'performance_check' && "Review Performance Metrics"}
                    {predictedAction === 'daily_summary' && "Create Daily Summary"}
                  </span>
                </div>
                <kbd className="px-2 py-1 text-xs bg-emerald-400/20 rounded text-emerald-400">⌘ P</kbd>
              </button>
            </div>
          )}
          
          {userPreferences.commonActions.length > 0 && (
            <div className="px-4 py-2 mb-2">
              <span className="text-xs text-slate-400 font-medium">RECENT</span>
              {userPreferences.commonActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-4 py-3 mt-1 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-4 text-slate-400" />
                    <span>{action}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-2">
            <span className="text-xs text-slate-400 font-medium">ALL COMMANDS</span>
            {[
              { icon: Brain, label: 'Train Model', shortcut: '⌘ T' },
              { icon: MessageSquare, label: 'New Conversation', shortcut: '⌘ N' },
              { icon: UserPlus, label: 'Add User', shortcut: '⌘ U' },
              { icon: Workflow, label: 'Edit Workflow', shortcut: '⌘ W' },
              { icon: FileText, label: 'View Logs', shortcut: '⌘ L' },
              { icon: GitBranch, label: 'Version Control', shortcut: '⌘ V' },
            ].map((command, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <command.icon className="w-5 h-5 text-emerald-400" />
                  <span>{command.label}</span>
                </div>
                <kbd className="px-2 py-1 text-xs bg-slate-700 rounded text-slate-400">
                  {command.shortcut}
                </kbd>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}