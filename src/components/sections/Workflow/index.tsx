import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  Workflow,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { VisualEditor } from './VisualEditor';

interface WorkflowProps {
  onCardClick: (id: string) => void;
}

export function WorkflowSection({ onCardClick }: WorkflowProps) {
  const [showEditor, setShowEditor] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowEditor(false);
    }
  };

  React.useEffect(() => {
    if (showEditor) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showEditor]);

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
                <Workflow className="w-6 h-6 text-emerald-400" />
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

      <AnimatePresence>
        {showEditor && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setShowEditor(false)}
            />

            {/* Футуристическая AR-панель */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5, y: 30 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: -5, 
                rotateX: 2, 
                y: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 90
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                rotateY: 15, 
                x: 100,
                transition: { duration: 0.4, ease: "easeInOut" }
              }}
              className="fixed inset-4 z-50 overflow-hidden"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Голографическая рамка */}
              <div className="absolute inset-0 rounded-xl border border-emerald-400/40 shadow-[0_0_30px_rgba(52,211,153,0.25)]" />
              
              {/* Анимированная светящаяся линия по контуру */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 animate-[glow_4s_ease-in-out_infinite]" 
                    style={{
                      clipPath: "inset(0 0 calc(100% - 2px) 0)",
                      animation: "glowScan 4s linear infinite"
                    }} />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 animate-[glow_4s_ease-in-out_infinite]" 
                    style={{
                      clipPath: "inset(0 0 0 calc(100% - 2px))",
                      animation: "glowScan 3.5s linear infinite"
                    }} />
                <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 animate-[glow_4s_ease-in-out_infinite]" 
                    style={{
                      clipPath: "inset(calc(100% - 2px) 0 0 0)",
                      animation: "glowScan 4.2s linear infinite"
                    }} />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 animate-[glow_4s_ease-in-out_infinite]" 
                    style={{
                      clipPath: "inset(0 calc(100% - 2px) 0 0)",
                      animation: "glowScan 3.8s linear infinite"
                    }} />
              </div>
              
              {/* Гексагональный паттерн по углам */}
              <div className="absolute top-0 left-0 w-40 h-40 opacity-30">
                <div className="absolute inset-0 animate-pulse" 
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2334D399' stroke-width='1'%3E%3Cpath d='M10 10l5 5-5 5 5 5-5 5m5-20h20m-20 5h20m-20 5h20m-20 5h20m-20 5h20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                      animation: "circuitFlow 10s linear infinite"
                    }}
                />
              </div>
              
              <div className="absolute top-0 right-0 w-40 h-40 opacity-30">
                <div className="absolute inset-0 animate-pulse" 
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2334D399' stroke-width='1'%3E%3Cpath d='M50 10l-5 5 5 5-5 5 5 5m-5-20H30m20 5H30m20 5H30m20 5H30m20 5H30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                      animation: "circuitFlow 10s linear infinite"
                    }}
                />
              </div>
              
              <div className="absolute bottom-0 left-0 w-40 h-40 opacity-30">
                <div className="absolute inset-0 animate-pulse" 
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2334D399' stroke-width='1'%3E%3Cpath d='M10 50l5-5-5-5 5-5-5-5m5 20h20m-20-5h20m-20-5h20m-20-5h20m-20-5h20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                      animation: "circuitFlow 10s linear infinite"
                    }}
                />
              </div>
              
              <div className="absolute bottom-0 right-0 w-40 h-40 opacity-30">
                <div className="absolute inset-0 animate-pulse" 
                    style={{ 
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2334D399' stroke-width='1'%3E%3Cpath d='M50 50l-5-5 5-5-5-5 5-5m-5 20H30m20-5H30m20-5H30m20-5H30m20-5H30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                      animation: "circuitFlow 10s linear infinite"
                    }}
                />
              </div>

              {/* Кнопка "Захлопнуть" в виде сферы */}
              <motion.button
                whileHover={{ scale: 1.2, boxShadow: "0 0 15px rgba(52,211,153,0.6)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditor(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 border border-emerald-400/40 flex items-center justify-center z-50 group"
              >
                <X className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                <div className="absolute inset-0 rounded-full bg-emerald-400/10 group-hover:bg-emerald-400/30 transition-colors" />
                <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(circle, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0) 70%)"
                    }} />
              </motion.button>

              {/* Основной контент */}
              <div className="h-full rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 overflow-hidden">
                <div className="h-full overflow-auto">
                  <style>{`
                    @keyframes glowScan {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                    
                    @keyframes circuitFlow {
                      0% { background-position: 0 0; }
                      100% { background-position: 60px 60px; }
                    }
                    
                    /* Стилизация кнопок и элементов формы для футуристического вида */
                    .futuristic-btn {
                      position: relative;
                      border: 1px solid rgba(52,211,153,0.3);
                      overflow: hidden;
                      transition: all 0.3s ease;
                      letter-spacing: 0.5px;
                      font-family: 'Orbitron', system-ui, sans-serif;
                    }
                    
                    .futuristic-btn:before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent);
                      transition: all 0.6s ease;
                    }
                    
                    .futuristic-btn:hover:before {
                      left: 100%;
                    }
                    
                    .futuristic-btn:hover {
                      box-shadow: 0 0 10px rgba(52,211,153,0.5);
                      background-color: rgba(52,211,153,0.15);
                    }
                    
                    /* Стилизация полей ввода */
                    .futuristic-input {
                      border: 1px solid rgba(52,211,153,0.3);
                      background: rgba(15, 23, 42, 0.3);
                      transition: all 0.3s ease;
                    }
                    
                    .futuristic-input:focus {
                      border-color: rgba(52,211,153,0.6);
                      box-shadow: 0 0 10px rgba(52,211,153,0.3);
                      outline: none;
                    }
                  `}</style>
                  <VisualEditor onClose={() => setShowEditor(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}