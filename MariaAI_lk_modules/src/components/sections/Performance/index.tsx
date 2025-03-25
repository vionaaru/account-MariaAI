import React from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PerformanceProps {
  onCardClick: (id: string) => void;
}

export function Performance({ onCardClick }: PerformanceProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Performance</h1>
        <button
          onClick={() => onCardClick('performance')}
          className="px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: '42%', trend: '-8%' },
          { label: 'Memory', value: '2.4GB', trend: '+0.2GB' },
          { label: 'Response Time', value: '120ms', trend: '-15ms' },
          { label: 'Active Users', value: '1,247', trend: '+82' },
        ].map((metric, index) => (
          <button
            key={index}
            onClick={() => onCardClick('performance')}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors text-left"
          >
            <span className="text-sm text-slate-400">{metric.label}</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`text-sm ${
                metric.trend.startsWith('-') ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {metric.trend}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { name: 'API Gateway', status: 'Operational' },
              { name: 'Database', status: 'Operational' },
              { name: 'ML Pipeline', status: 'Operational' },
              { name: 'Cache Layer', status: 'Degraded' }
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'Operational' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-sm">{service.name}</span>
                </div>
                <span className={`text-sm ${
                  service.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
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
    </div>
  );
}