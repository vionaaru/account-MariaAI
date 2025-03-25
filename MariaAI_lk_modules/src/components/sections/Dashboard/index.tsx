import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Brain,
  Sparkles,
  Activity,
  Command,
  Bot,
  AlertCircle,
  CheckCircle,
  XCircle,
  Cpu
} from 'lucide-react';

interface DashboardProps {
  onCardClick: (id: string) => void;
  setShowCommandPalette: (show: boolean) => void;
}

export function Dashboard({ onCardClick, setShowCommandPalette }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowCommandPalette(true)}
          className="px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center gap-2"
        >
          <Command className="w-5 h-5" />
          <span>Command Menu</span>
          <kbd className="ml-2 px-2 py-1 text-xs bg-slate-600 rounded">⌘ K</kbd>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'conversations', icon: MessageSquare, label: 'Active Conversations', value: '24', trend: '+12%' },
          { id: 'response', icon: Brain, label: 'Avg. Response Time', value: '1.2s', trend: '-15%' },
          { id: 'satisfaction', icon: Sparkles, label: 'Satisfaction Rate', value: '94%', trend: '+3%' },
          { id: 'interactions', icon: Activity, label: 'Daily Interactions', value: '1,247', trend: '+8%' },
        ].map((stat) => (
          <button
            key={stat.id}
            onClick={() => onCardClick(stat.id)}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-400">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">System Status</h2>
            <button
              onClick={() => onCardClick('performance')}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View Details
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <div className="text-2xl font-bold">42%</div>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Response Time</span>
                </div>
                <div className="text-2xl font-bold">120ms</div>
              </div>
            </div>
            <div className="bg-emerald-400/10 border border-emerald-400/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Events</h2>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { event: 'Auto-scaling triggered', time: '2m ago', type: 'info' },
              { event: 'High memory usage detected', time: '15m ago', type: 'warning' },
              { event: 'Cache layer degraded', time: '1h ago', type: 'error' },
              { event: 'System backup completed', time: '2h ago', type: 'success' }
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {event.type === 'info' && <Activity className="w-4 h-4 text-blue-400" />}
                  {event.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {event.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
                  {event.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  <span className="text-sm">{event.event}</span>
                </div>
                <span className="text-xs text-slate-400">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onCardClick('alerts')}
        className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 hover:bg-rose-500/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-semibold text-rose-400">Attention Required</h2>
        </div>
        <p className="text-slate-300">
          3 conversations have been flagged for review due to low confidence scores.
        </p>
      </button>
    </div>
  );
}