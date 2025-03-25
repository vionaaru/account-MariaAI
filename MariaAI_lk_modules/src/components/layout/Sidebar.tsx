import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  BarChart3, 
  MessageSquare, 
  Workflow,
  BookOpen,
  Activity,
  Bell,
  Keyboard
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const navigationItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'conversations', icon: MessageSquare, label: 'Conversations' },
    { id: 'workflow', icon: Workflow, label: 'Workflow' },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge' },
    { id: 'performance', icon: Activity, label: 'Performance' },
  ];

  return (
    <nav className="w-20 lg:w-64 border-r border-slate-700/50 p-4 flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Bot className="w-8 h-8 text-emerald-400" />
        <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          NeoLLM
        </span>
      </motion.div>

      <div className="space-y-2">
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-slate-700/50 text-emerald-400'
                : 'hover:bg-slate-700/30'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden lg:block">{item.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="hidden lg:block">Notifications</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-colors"
        >
          <Keyboard className="w-5 h-5" />
          <span className="hidden lg:block">Shortcuts</span>
        </motion.button>
      </div>
    </nav>
  );
}