import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Workflow,
  Layers,
  ChevronRight
} from 'lucide-react';
import { VisualEditor } from './VisualEditor';

interface WorkflowProps {
  onCardClick: (id: string) => void;
}

export function WorkflowSection({ onCardClick }: WorkflowProps) {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <VisualEditor />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflow</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            name: 'Customer Support',
            description: 'Handle general customer inquiries',
            steps: 5,
            active: true
          },
          {
            name: 'Sales Inquiry',
            description: 'Process and qualify sales leads',
            steps: 4,
            active: true
          },
          {
            name: 'Technical Support',
            description: 'Resolve technical issues and bugs',
            steps: 6,
            active: false
          },
          {
            name: 'Feedback Collection',
            description: 'Gather and process user feedback',
            steps: 3,
            active: true
          }
        ].map((workflow, index) => (
          <button
            key={index}
            onClick={() => onCardClick('workflow')}
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Workflow className="w-6  h-6 text-emerald-400" />
                <h3 className="font-semibold">{workflow.name}</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                workflow.active 
                  ? 'bg-emerald-400/20 text-emerald-400'
                  : 'bg-slate-600/20 text-slate-400'
              }`}>
                {workflow.active ? 'Active' : 'Draft'}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{workflow.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{workflow.steps} steps</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}