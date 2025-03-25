import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

interface ConversationsProps {
  onCardClick: (id: string) => void;
}

export function Conversations({ onCardClick }: ConversationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-64 px-4 py-2 bg-slate-700/30 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((_, index) => (
          <button
            key={index}
            onClick={() => onCardClick(`chat-${index}`)}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="font-medium">Customer #{1000 + index}</span>
              </div>
              <span className="text-sm text-slate-400">4m ago</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Last message: I need help with my account settings...
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full">
                Account Support
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400">Bot Handling</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}