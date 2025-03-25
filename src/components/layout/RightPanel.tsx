import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  X,
  Clock,
  Tag,
  Star,
  MessageCircle,
  Zap,
  Shield,
  Layers,
  Workflow,
} from 'lucide-react';

interface RightPanelProps {
  selectedCard: string | null;
  onClose: () => void;
}

export function RightPanel({ selectedCard, onClose }: RightPanelProps) {
  const renderContent = () => {
    switch (selectedCard) {
      case 'workflow':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Workflow Configuration</h3>
              <div className="space-y-3">
                {[
                  { name: 'Initial Greeting', active: true },
                  { name: 'Intent Classification', active: true },
                  { name: 'Sentiment Analysis', active: false },
                  { name: 'Response Generation', active: true },
                  { name: 'Human Handoff', active: true },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{step.name}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full ${step.active ? 'bg-emerald-400' : 'bg-slate-600'}`}>
                      <div 
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          step.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  Last updated: {format(new Date(), 'HH:mm')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">Category: Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">Priority: High</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recent Activity</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-700/30 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium">New message received</span>
                    </div>
                    <p className="text-sm text-slate-400">Customer requested additional information</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Take Over</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Block</span>
                </motion.button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="w-80 border-l border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Details</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {renderContent()}
    </motion.div>
  );
}