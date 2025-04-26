import React, { useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  FileJson,
  Upload,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  MessageSquare,
  Clock,
  Edit2,
  AlertCircle,
  Check,
  XCircle
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';

// Types
interface Stage {
  name: string;
  prompt: string;
  question: string;
  theme: string;
  offer: string;
  terminal: string;
  terms: string;
  time: string;
  segments: Segment[];
  wakeups: Wakeup[];
}

interface Segment {
  id: string;
  type: string;
  description: string;
  examples: string[];
}

interface Wakeup {
  trigger: string;
  timer: number;
  prompt: string;
  question: string;
}

interface BotConfig {
  company: {
    lang: string;
    salesperson_name: string;
    salesperson_gender: string;
    salesperson_role: string;
    product: string;
    company_name: string;
  };
  config: {
    version: number;
    created_at: string;
  };
  content: {
    wakeups_base: string[];
    thank_you_note: string;
  };
  stages: Stage[];
}

// Confirmation Modal Component
function ConfirmationModal({ message, onConfirm, onCancel }: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateY: 5 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative border border-emerald-400/30"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Уголки с декоративными элементами */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-emerald-400/40" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-emerald-400/40" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-emerald-400/40" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-emerald-400/40" />
        
        {/* Светящаяся линия сверху */}
        <div className="absolute top-0 left-4 right-4 h-0.5 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/60 to-emerald-500/0" 
            style={{ animation: "glowScan 3s linear infinite" }} 
          />
        </div>
        
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90">{message}</h3>
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Отмена</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Подтвердить</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Modal Component
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: 2 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateX: -2 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl max-w-2xl w-full mx-4 border border-emerald-400/30 overflow-hidden"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        <div className="relative">
          {/* Декоративная линия сверху */}
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/60 to-emerald-500/0" 
              style={{ animation: "glowScan 3s linear infinite" }} 
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.2, boxShadow: "0 0 15px rgba(52,211,153,0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800/90 border border-emerald-400/30 flex items-center justify-center z-50 group transition-all"
          >
            <X className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
            <div className="absolute inset-0 rounded-full bg-emerald-400/10 group-hover:bg-emerald-400/30 transition-colors" />
          </motion.button>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Segment Form Modal
function SegmentFormModal({ segment, onSave, onClose }: {
  segment: Segment;
  onSave: (segment: Segment) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: segment
  });

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90">Редактирование сегмента</h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Тип
            </label>
            <input
              {...register('type')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Описание
            </label>
            <textarea
              {...register('description')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Примеры
            </label>
            <div className="space-y-2">
              {segment.examples.map((_, index) => (
                <input
                  key={index}
                  {...register(`examples.${index}`)}
                  className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              Отмена
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all"
            >
              Сохранить изменения
            </motion.button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Wakeup Form Modal
function WakeupFormModal({ wakeup, onSave, onClose }: {
  wakeup: Wakeup;
  onSave: (wakeup: Wakeup) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: wakeup
  });

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90">Редактирование пробуждения</h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Триггер
              </label>
              <input
                {...register('trigger')}
                className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Таймер (секунды)
              </label>
              <input
                type="number"
                {...register('timer')}
                className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Подсказка
            </label>
            <textarea
              {...register('prompt')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Вопрос
            </label>
            <input
              {...register('question')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              Отмена
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all"
            >
              Сохранить изменения
            </motion.button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Sortable Stage Card Component
function SortableStageCard({ stage, index, onDelete, onToggle, isExpanded, onUpdateStage }: {
  stage: Stage;
  index: number;
  onDelete: () => void;
  onToggle: () => void;
  isExpanded: boolean;
  onUpdateStage: (stage: Stage) => void;
}) {
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [editingWakeup, setEditingWakeup] = useState<Wakeup | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stage.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSegmentSave = (updatedSegment: Segment) => {
    const updatedStage = {
      ...stage,
      segments: stage.segments.map(seg =>
        seg.id === updatedSegment.id ? updatedSegment : seg
      )
    };
    onUpdateStage(updatedStage);
    setEditingSegment(null);
  };

  const handleWakeupSave = (updatedWakeup: Wakeup) => {
    const updatedStage = {
      ...stage,
      wakeups: stage.wakeups.map((wake, idx) => {
        const editingIndex = stage.wakeups.findIndex(w => w === editingWakeup);
        return idx === editingIndex ? updatedWakeup : wake;
      })
    };
    onUpdateStage(updatedStage);
    setEditingWakeup(null);
  };

  const addNewSegment = () => {
    const newSegment: Segment = {
      id: `seg${Date.now()}`,
      type: '',
      description: '',
      examples: []
    };
    onUpdateStage({
      ...stage,
      segments: [...stage.segments, newSegment]
    });
    setEditingSegment(newSegment);
  };

  const addNewWakeup = () => {
    const newWakeup: Wakeup = {
      trigger: '',
      timer: 15,
      prompt: '',
      question: ''
    };
    onUpdateStage({
      ...stage,
      wakeups: [...stage.wakeups, newWakeup]
    });
    setEditingWakeup(newWakeup);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 mb-4"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div {...attributes} {...listeners}>
              <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
            </div>
            <h3 className="text-lg font-semibold">{stage.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Prompt
                      </label>
                      <textarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={3}
                        value={stage.prompt}
                        onChange={(e) => onUpdateStage({ ...stage, prompt: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        value={stage.question}
                        onChange={(e) => onUpdateStage({ ...stage, question: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Theme
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        value={stage.theme}
                        onChange={(e) => onUpdateStage({ ...stage, theme: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Offer
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        value={stage.offer}
                        onChange={(e) => onUpdateStage({ ...stage, offer: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Segments Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Segments</h4>
                    <button
                      onClick={addNewSegment}
                      className="px-3 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-lg text-sm hover:bg-emerald-400/20 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Segment
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stage.segments.map((segment) => (
                      <button
                        key={segment.id}
                        onClick={() => setEditingSegment(segment)}
                        className="bg-slate-700/30 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">{segment.type || 'Untitled Segment'}</span>
                          </div>
                          <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {segment.description || 'No description'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <AlertCircle className="w-3 h-3" />
                          {segment.examples.length} examples
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wakeups Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Wakeups</h4>
                    <button
                      onClick={addNewWakeup}
                      className="px-3 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-lg text-sm hover:bg-emerald-400/20 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Wakeup
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stage.wakeups.map((wakeup, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEditingWakeup(wakeup)}
                        className="bg-slate-700/30 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">{wakeup.trigger || 'Untitled Wakeup'}</span>
                          </div>
                          <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {wakeup.prompt || 'No prompt'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {wakeup.timer}s timeout
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingSegment && (
          <SegmentFormModal
            segment={editingSegment}
            onSave={handleSegmentSave}
            onClose={() => setEditingSegment(null)}
          />
        )}
        {editingWakeup && (
          <WakeupFormModal
            wakeup={editingWakeup}
            onSave={handleWakeupSave}
            onClose={() => setEditingWakeup(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface VisualEditorProps {
  onClose: () => void;
}

export function VisualEditor({ onClose }: VisualEditorProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedStages, setExpandedStages] = useState<string[]>([]);
  const [configName, setConfigName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<BotConfig>({
    company: {
      lang: 'Русский',
      salesperson_name: 'Мария',
      salesperson_gender: 'Женский',
      salesperson_role: 'Эксперт с опытом дайвинга более 20 лет',
      product: 'собранная информация о клиенте',
      company_name: 'Время Нырять'
    },
    config: {
      version: 4,
      created_at: new Date().toISOString()
    },
    content: {
      wakeups_base: ['Вы с нами? 😊', 'Если удобно, я продолжу!'],
      thank_you_note: 'Спасибо за интерес — надеюсь, погружение будет волшебным!'
    },
    stages: [
      {
        name: 'Приветствие',
        prompt: 'Поприветствуй клиента, представься расскажи о себе…',
        question: 'Подскажите, пожалуйста, как я могу к вам обращаться?',
        theme: 'Обращение к клиенту',
        offer: '',
        terminal: '',
        terms: '',
        time: '',
        segments: [
          {
            id: 'seg1',
            type: 'Нет ответа',
            description: 'Клиент не дал никакого ответа',
            examples: []
          },
          {
            id: 'seg2',
            type: 'Имя указано',
            description: 'Клиент представился нормальным тоном',
            examples: ['Меня зовут Анна', 'Алексей', 'Можно просто Миша']
          }
        ],
        wakeups: [
          {
            trigger: 'no_response_15s',
            timer: 15,
            prompt: 'Я тут, если что! Могу задать вопрос?',
            question: 'Как к вам обращаться, чтобы было удобно?'
          }
        ]
      }
    ]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleStageExpansion = (stageName: string) => {
    setExpandedStages(prev =>
      prev.includes(stageName)
        ? prev.filter(name => name !== stageName)
        : [...prev, stageName]
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setConfig(prev => {
        const oldIndex = prev.stages.findIndex(stage => stage.name === active.id);
        const newIndex = prev.stages.findIndex(stage => stage.name === over.id);

        return {
          ...prev,
          stages: arrayMove(prev.stages, oldIndex, newIndex),
        };
      });
    }
  };

  const addNewStage = () => {
    const newStage: Stage = {
      name: `Новая стадия ${config.stages.length + 1}`,
      prompt: '',
      question: '',
      theme: '',
      offer: '',
      terminal: '',
      terms: '',
      time: '',
      segments: [],
      wakeups: []
    };

    setConfig(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
    setExpandedStages(prev => [...prev, newStage.name]);
  };

  const deleteStage = (stageName: string) => {
    setConfig(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.name !== stageName)
    }));
    setExpandedStages(prev => prev.filter(name => name !== stageName));
  };

  const updateStage = (updatedStage: Stage) => {
    setConfig(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.name === updatedStage.name ? updatedStage : stage
      )
    }));
  };

  const exportToJson = () => {
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bot-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveConfig = async () => {
    if (!configName.trim()) {
      alert('Please enter a config name');
      return;
    }

    try {
      await performSave();
    } catch (err) {
      alert('Error saving config: ' + err);
    }
  };

  const performSave = async () => {
    const response = await fetch('/api/save-config', {
      method: 'POST',
      body: JSON.stringify({
        name: configName.trim(),
        content: config
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error || 'Unknown error');
    }

    alert('Config saved successfully!');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedConfig = JSON.parse(text);
      setConfig(importedConfig);
      setConfigName(file.name.replace('.json', ''));
      alert('Config imported successfully!');
    } catch (error) {
      alert('Error importing config: ' + error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Визуальный редактор
          </h2>
          <input
            type="text"
            placeholder="Имя конфигурации"
            className="px-4 py-2 futuristic-input bg-slate-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportToJson()}
            className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-2 group"
          >
            <FileJson className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
            <span>Экспорт JSON</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleImport}
            className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-2 group"
          >
            <Upload className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
            <span>Импорт</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={saveConfig}
            className="futuristic-btn px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg hover:bg-emerald-500 transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Сохранить</span>
          </motion.button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileSelect}
      />

      <Tabs
        selectedIndex={activeTab}
        onSelect={index => setActiveTab(index)}
        className="h-[calc(100%-5rem)] px-6"
      >
        <TabList className="flex border-b border-slate-700/50 mb-6">
          <Tab
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 0
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Настройки бота
          </Tab>
          <Tab
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 1
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Стадии
          </Tab>
        </TabList>

        <TabPanel className="h-[calc(100%-3rem)] overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Company Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-700/30 rounded-lg p-2"
                    value={config.company.lang}

                    onChange={e => setConfig(prev => ({
                      ...prev,
                      company: { ...prev.company, lang: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-700/30 rounded-lg p-2"
                    value={config.company.company_name}
                    onChange={e => setConfig(prev => ({
                      ...prev,
                      company: { ...prev.company, company_name: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Wakeup Messages
                  </label>
                  {config.content.wakeups_base.map((msg, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="w-full bg-slate-700/30 rounded-lg p-2 mb-2"
                      value={msg}
                      onChange={e => {
                        const newWakeups = [...config.content.wakeups_base];
                        newWakeups[idx] = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          content: { ...prev.content, wakeups_base: newWakeups }
                        }));
                      }}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Thank You Note
                  </label>
                  <textarea
                    className="w-full bg-slate-700/30 rounded-lg p-2"
                    rows={3}
                    value={config.content.thank_you_note}
                    onChange={e => setConfig(prev => ({
                      ...prev,
                      content: { ...prev.content, thank_you_note: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel className="h-[calc(100%-3rem)] overflow-y-auto">
          <div className="space-y-4">
            <button
              onClick={addNewStage}
              className="w-full px-4 py-3 futuristic-btn bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400/20 transition-all flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить новую стадию</span>
            </button>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={config.stages.map(stage => stage.name)}
                strategy={verticalListSortingStrategy}
              >
                {config.stages.map((stage, index) => (
                  <SortableStageCard
                    key={stage.name}
                    stage={stage}
                    index={index}
                    onDelete={() => deleteStage(stage.name)}
                    onToggle={() => toggleStageExpansion(stage.name)}
                    isExpanded={expandedStages.includes(stage.name)}
                    onUpdateStage={updateStage}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}