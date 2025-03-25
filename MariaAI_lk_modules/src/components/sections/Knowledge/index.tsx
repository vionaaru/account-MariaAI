import React from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  PlusCircle,
  FileText,
  BookOpen,
  Brain,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface KnowledgeProps {
  onCardClick: (id: string) => void;
}

export function Knowledge({ onCardClick }: KnowledgeProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => onCardClick('knowledge')}
            className="px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Source</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            name: 'Documentation',
            icon: FileText,
            count: 156,
            updated: '2h ago'
          },
          {
            name: 'FAQ Database',
            icon: BookOpen,
            count: 89,
            updated: '1h ago'
          },
          {
            name: 'Training Data',
            icon: Brain,
            count: 234,
            updated: '30m ago'
          }
        ].map((source, index) => (
          <button
            key={index}
            onClick={() => onCardClick('knowledge')}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-4">
              <source.icon className="w-6 h-6 text-emerald-400" />
              <h3 className="font-semibold">{source.name}</h3>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{source.count} documents</span>
              <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full">
                Updated {source.updated}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400">Synced</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
        <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
        <div className="space-y-4">
          {[
            { action: 'New Document Added', source: 'API Documentation', time: '5m ago' },
            { action: 'Content Updated', source: 'Product FAQ', time: '15m ago' },
            { action: 'Source Synced', source: 'Training Data', time: '30m ago' }
          ].map((update, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-medium">{update.action}</div>
                  <div className="text-xs text-slate-400">{update.source}</div>
                </div>
              </div>
              <span className="text-xs text-slate-400">{update.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}