import React, { useState, useRef, useEffect, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';
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
    company_business?: string;
    conversation_type?: string;
    answer_style?: string;
  };
  config: {
    version: number;
    created_at: string;
    wakeup_check_interval?: number; 
    message_pause_interval?: number;
    format_attempt?: boolean;
    data_command_trigger?: boolean;
    semantic_filter?: boolean;
    message_filter?: boolean;
    error_messages?: boolean;
    not_safe_compose?: boolean;
    public_access?: boolean;
    test_mode?: boolean;
  };
  content: {
    wakeups_base: string[];
    thank_you_note: string;
    memory_data_columns?: { title: string, value: string }[];
    format_answer_columns?: { title: string, value: string }[];
    start_command_trigger?: string;
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
        
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90 font-neuropol">{message}</h3>
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-2 font-neuropol"
          >
            <XCircle className="w-5 h-5" />
            <span>Отмена</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2 font-neuropol"
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
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: 10, translateZ: -100 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0, translateZ: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateY: -10, translateZ: -100 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl max-w-2xl w-full mx-4 border-0 relative overflow-hidden ar-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          boxShadow: "0 0 20px rgba(52,211,153,0.3), 0 0 40px rgba(10,20,50,0.2)"
        }}
      >
        {/* Футуристические уголки */}
        <div className="absolute top-0 left-0 w-20 h-20 origin-top-left">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M0 0H60C60 0 80 0 80 20V25H55V0H0V25" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" />
            <rect x="10" y="5" width="3" height="3" fill="rgba(52,211,153,0.8)" className="animate-blinkSlow" />
            <rect x="30" y="5" width="2" height="2" fill="rgba(52,211,153,0.6)" className="animate-blinkFast" />
            <rect x="60" y="25" width="2" height="2" fill="rgba(52,211,153,0.6)" className="animate-blinkMedium" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 origin-top-right">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: "scaleX(-1)" }}>
            <path d="M0 0H60C60 0 80 0 80 20V25H55V0H0V25" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" />
            <rect x="10" y="5" width="3" height="3" fill="rgba(52,211,153,0.8)" className="animate-blinkFast" />
            <rect x="30" y="5" width="2" height="2" fill="rgba(52,211,153,0.6)" className="animate-blinkSlow" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 origin-bottom-left">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: "scaleY(-1)" }}>
            <path d="M0 0H60C60 0 80 0 80 20V25H55V0H0V25" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" />
            <rect x="10" y="5" width="3" height="3" fill="rgba(52,211,153,0.8)" className="animate-blinkMedium" />
            <rect x="60" y="25" width="2" height="2" fill="rgba(52,211,153,0.6)" className="animate-blinkSlow" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 origin-bottom-right">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: "scale(-1)" }}>
            <path d="M0 0H60C60 0 80 0 80 20V25H55V0H0V25" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" />
            <rect x="30" y="5" width="2" height="2" fill="rgba(52,211,153,0.6)" className="animate-blinkFast" />
            <rect x="60" y="25" width="2" height="2" fill="rgba(52,211,153,0.7)" className="animate-blinkMedium" />
          </svg>
        </div>
                
        {/* Футуристическая рамка с анимацией */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-0.5 glow-line">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/80 to-emerald-500/0 animate-glowScan" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 glow-line">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/80 to-emerald-500/0 animate-glowScan" style={{animationDelay: "1s"}} />
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-0.5 glow-line">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-400/80 to-emerald-500/0 animate-glowScanVertical" />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-0.5 glow-line">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 via-emerald-400/80 to-emerald-500/0 animate-glowScanVertical" style={{animationDelay: "1.5s"}} />
          </div>
        </div>

        {/* "Сфера" закрытия в правом верхнем углу */}
        <div className="absolute right-6 top-6 z-50">
          <motion.button
            whileHover={{ 
              scale: 1.2, 
              rotate: 90,
              boxShadow: "0 0 32px 8px rgba(52,211,153,0.7)",
              backgroundColor: "rgba(52,211,153,0.2)" 
            }}
            whileTap={{ scale: 0.8, rotate: 180 }}
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800/40 border border-emerald-400/30 flex items-center justify-center group transition-all relative overflow-hidden"
          >
            {/* Внутренняя подсветка */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 group-hover:opacity-100 opacity-0 transition-opacity animate-spin-slow" />
            {/* Анимированные кольца */}
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="block w-8 h-8 rounded-full border border-emerald-400/30 animate-krestRing1 opacity-0 group-hover:opacity-100" />
              <span className="block w-10 h-10 rounded-full border border-emerald-400/20 animate-krestRing2 opacity-0 group-hover:opacity-80" />
            </span>
            {/* Иконка */}
            <X className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors relative z-10" />
            {/* Внешнее свечение */}
            <div className="absolute -inset-1 rounded-full bg-emerald-400/5 group-hover:bg-emerald-400/20 transition-colors blur-md" />
          </motion.button>
        </div>

        <div className="relative">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Автоматически расширяющаяся textarea
function AutoResizeTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      // Получаем высоту одной строки
      const singleRowHeight = el.scrollHeight;
      // Временно очищаем значение, чтобы корректно измерить одну строку
      const value = el.value;
      el.value = '';
      el.style.height = 'auto';
      const oneLineHeight = el.scrollHeight;
      el.value = value;
      // Если содержимое одна строка — высота одной строки, иначе scrollHeight
      el.style.height = (el.value.split('\n').length === 1 ? oneLineHeight : el.scrollHeight) + 'px';
    }
  };

  useEffect(() => {
    resize();
    // eslint-disable-next-line
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      className={`futuristic-input futuristic-input-singleline ${props.className || ''}`}
      rows={1}
      onInput={e => {
        resize();
        props.onInput && props.onInput(e);
      }}
      style={{ ...props.style, overflow: 'hidden', resize: 'none' }}
    />
  );
}

// Автоматически расширяющийся input
function AutoResizeInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 24); // +24px для паддинга и border
    }
  }, [props.value]);

  return (
    <>
      <input
        {...props}
        ref={inputRef}
        style={{ ...props.style, width: inputWidth, minWidth: 80, maxWidth: '100%' }}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden',
          whiteSpace: 'pre',
          fontSize: inputRef.current?.style.fontSize || 'inherit',
          fontFamily: inputRef.current?.style.fontFamily || 'inherit',
          fontWeight: inputRef.current?.style.fontWeight || 'inherit',
          letterSpacing: inputRef.current?.style.letterSpacing || 'inherit',
          padding: inputRef.current?.style.padding || 'inherit',
        }}
      >
        {props.value || props.placeholder || ''}
      </span>
    </>
  );
}

// Segment Form Modal
function SegmentFormModal({ segment, onSave, onClose, segmentIndex = 0 }: {
  segment: Segment;
  onSave: (segment: Segment) => void;
  onClose: () => void;
  segmentIndex?: number;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: segment
  });

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90 font-neuropol">
          Редактирование segment{segmentIndex + 1}
        </h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 font-tektur">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              segment{segmentIndex + 1} (тип)
            </label>
            <AutoResizeTextarea
              {...register('type')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              description{segmentIndex + 1}
            </label>
            <AutoResizeTextarea
              {...register('description')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              examples{segmentIndex + 1}
            </label>
            <div className="space-y-2">
              {segment.examples.map((_, index) => (
                <AutoResizeTextarea
                  key={index}
                  {...register(`examples.${index}`)}
                  className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
                  rows={1}
                  placeholder={`Пример ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const newExample = '';
                  segment.examples.push(newExample);
                  // Заставляем форму обновиться
                  onSave({...segment, examples: [...segment.examples]});
                }}
                className="mt-1 px-2 py-1 bg-slate-700/30 text-xs rounded hover:bg-slate-700/50 text-slate-400"
              >
                + Добавить пример
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 10px rgba(52,211,153,0.3)",
                backgroundColor: "rgba(51, 65, 85, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg transition-all font-neuropol relative overflow-hidden group"
            >
              <span className="relative z-10">Отмена</span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 via-slate-600/30 to-slate-700/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{animation: "bgPulse 2s ease-in-out infinite alternate"}} />
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 15px rgba(52,211,153,0.6)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all font-neuropol relative overflow-hidden group"
            >
              <span className="relative z-10">Сохранить</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/50 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{animation: "bgPulse 2s ease-in-out infinite alternate"}} />
            </motion.button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Wakeup Form Modal
function WakeupFormModal({ wakeup, onSave, onClose, wakeupIndex = 0 }: {
  wakeup: Wakeup;
  onSave: (wakeup: Wakeup) => void;
  onClose: () => void;
  wakeupIndex?: number;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: wakeup
  });

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-emerald-400/90 font-neuropol">
          Редактирование параметров пробуждения {wakeupIndex + 1}
        </h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 font-tektur">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                trigger{wakeupIndex + 1}
              </label>
              <AutoResizeTextarea
                {...register('trigger')}
                className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
                rows={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                timer{wakeupIndex + 1} (секунды)
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
              prompt{wakeupIndex + 1}
            </label>
            <AutoResizeTextarea
              {...register('prompt')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              question{wakeupIndex + 1}
            </label>
            <AutoResizeTextarea
              {...register('question')}
              className="w-full futuristic-input bg-slate-700/30 rounded-lg p-2"
              rows={1}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 10px rgba(52,211,153,0.3)",
                backgroundColor: "rgba(51, 65, 85, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="futuristic-btn px-4 py-2 bg-slate-700/30 rounded-lg transition-all font-neuropol relative overflow-hidden group"
            >
              <span className="relative z-10">Отмена</span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700/0 via-slate-600/30 to-slate-700/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{animation: "bgPulse 2s ease-in-out infinite alternate"}} />
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 15px rgba(52,211,153,0.6)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="futuristic-btn px-4 py-2 bg-emerald-400/80 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all font-neuropol relative overflow-hidden group"
            >
              <span className="relative z-10">Сохранить</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/50 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{animation: "bgPulse 2s ease-in-out infinite alternate"}} />
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
                        Имя стадии
                      </label>
                      <AutoResizeTextarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={1}
                        value={stage.name}
                        onChange={(e) => onUpdateStage({ ...stage, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Prompt
                      </label>
                      <AutoResizeTextarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={1}
                        value={stage.prompt}
                        onChange={(e) => onUpdateStage({ ...stage, prompt: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Question
                      </label>
                      <AutoResizeTextarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={1}
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
                      <AutoResizeTextarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={1}
                        value={stage.theme}
                        onChange={(e) => onUpdateStage({ ...stage, theme: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Offer
                      </label>
                      <AutoResizeTextarea
                        className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                        rows={1}
                        value={stage.offer}
                        onChange={(e) => onUpdateStage({ ...stage, offer: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Full_text
                    </label>
                    <AutoResizeTextarea
                      className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                      rows={1}
                      value={stage.terminal || ''}
                      onChange={(e) => onUpdateStage({ ...stage, terminal: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Terminal
                    </label>
                    <AutoResizeTextarea
                      className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                      rows={1}
                      value={stage.terminal || ''}
                      onChange={(e) => onUpdateStage({ ...stage, terminal: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Terms
                    </label>
                    <AutoResizeTextarea
                      className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                      rows={1}
                      value={stage.terms || ''}
                      onChange={(e) => onUpdateStage({ ...stage, terms: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">
                      Time
                    </label>
                    <AutoResizeTextarea
                      className="w-full bg-slate-700/30 rounded-lg p-2 text-sm"
                      rows={1}
                      value={stage.time || ''}
                      onChange={(e) => onUpdateStage({ ...stage, time: e.target.value })}
                    />
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
                    {stage.segments.map((segment, segmentIndex) => (
                      <button
                        key={segment.id}
                        onClick={() => setEditingSegment(segment)}
                        className="bg-slate-700/30 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">segment{segmentIndex + 1}: {segment.type || 'Untitled'}</span>
                          </div>
                          <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          description{segmentIndex + 1}: {segment.description || 'No description'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <AlertCircle className="w-3 h-3" />
                          examples{segmentIndex + 1}: {segment.examples.length} примеров
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
                    {stage.wakeups.map((wakeup, wakeupIndex) => (
                      <button
                        key={wakeupIndex}
                        onClick={() => setEditingWakeup(wakeup)}
                        className="bg-slate-700/30 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">trigger{wakeupIndex + 1}: {wakeup.trigger || 'Untitled'}</span>
                          </div>
                          <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          prompt{wakeupIndex + 1}: {wakeup.prompt || 'No prompt'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          timer{wakeupIndex + 1}: {wakeup.timer}s
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
            segmentIndex={stage.segments.findIndex(seg => seg.id === editingSegment.id)}
          />
        )}
        {editingWakeup && (
          <WakeupFormModal
            wakeup={editingWakeup}
            onSave={handleWakeupSave}
            onClose={() => setEditingWakeup(null)}
            wakeupIndex={stage.wakeups.findIndex(w => w === editingWakeup)}
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
  const [baseUrl, setBaseUrl] = useState('');
  const [wakeupsUrl, setWakeupsUrl] = useState('');
  const [tabTransition, setTabTransition] = useState(false);

  // Обработчик переключения табов с анимацией
  const handleTabChange = (index: number) => {
    if (index === activeTab) return;
    
    // Запускаем анимацию перехода
    setTabTransition(true);
    
    // Устанавливаем небольшую задержку перед сменой таба для анимации
    setTimeout(() => {
      setActiveTab(index);
      
      // Отключаем анимацию перехода после завершения
      setTimeout(() => {
        setTabTransition(false);
      }, 600);
    }, 400);
  };
  
  const [config, setConfig] = useState<BotConfig>({
    company: {
      lang: 'Русский',
      salesperson_name: 'Мария',
      salesperson_gender: 'Женский',
      salesperson_role: 'Эксперт с опытом дайвинга более 20 лет',
      product: 'собранная информация о клиенте',
      company_name: 'Время Нырять',
      company_business: 'Школа по нейросетям',
      conversation_type: 'чат в Telegram',
      answer_style: 'Общайся обычно, по-дружески, неформально. Обращайся на "Вы". Не используй слово "Понимаю"'
    },
    config: {
      version: 4,
      created_at: new Date().toISOString(),
      wakeup_check_interval: 30,
      message_pause_interval: 30,
      format_attempt: false,
      data_command_trigger: true,
      semantic_filter: false,
      message_filter: false,
      error_messages: false,
      not_safe_compose: true,
      public_access: true,
      test_mode: false
    },
    content: {
      wakeups_base: ['Вы с нами? 😊', 'Если удобно, я продолжу!'],
      thank_you_note: 'Спасибо за интерес — надеюсь, погружение будет волшебным!',
      memory_data_columns: [
        { title: 'Имя клиента', value: '' },
        { title: 'День и время старта первого занятия', value: '' }
      ],
      format_answer_columns: [
        { title: 'Колонка 1', value: '' },
        { title: 'Колонка 2', value: '' }
      ],
      start_command_trigger: '/start'
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
    // Создаем копию текущей конфигурации для экспорта
    const exportConfig = { ...config };
    
    // Обновляем текущую дату создания
    exportConfig.config.created_at = new Date().toISOString();
    
    // Форматируем JSON и скачиваем
    const jsonString = JSON.stringify(exportConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = configName.trim() ? `${configName.trim()}.json` : 'bot-config.json';
    a.download = fileName;
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

  // Инициализация колонок, если их нет
  useEffect(() => {
    if (!config.content.memory_data_columns) {
      setConfig(prev => ({
        ...prev,
        content: { 
          ...prev.content, 
          memory_data_columns: [
            { title: 'Имя клиента', value: '' },
            { title: 'День и время старта первого занятия', value: '' }
          ]
        }
      }));
    }

    if (!config.content.format_answer_columns) {
      setConfig(prev => ({
        ...prev,
        content: { 
          ...prev.content, 
          format_answer_columns: [
            { title: 'Колонка 1', value: '' },
            { title: 'Колонка 2', value: '' }
          ] 
        }
      }));
    }
  }, []);

  // Функция для добавления колонки memory_data
  const addMemoryDataColumn = () => {
    setConfig(prev => {
      const columns = prev.content.memory_data_columns || [];
      return {
        ...prev,
        content: {
          ...prev.content,
          memory_data_columns: [...columns, { title: `Колонка ${columns.length + 1}`, value: '' }]
        }
      };
    });
  };

  // Функция для удаления колонки memory_data
  const removeMemoryDataColumn = (index: number) => {
    setConfig(prev => {
      const columns = prev.content.memory_data_columns || [];
      if (columns.length <= 1) return prev; // Не удаляем последнюю колонку
      
      return {
        ...prev,
        content: {
          ...prev.content,
          memory_data_columns: columns.filter((_, i) => i !== index)
        }
      };
    });
  };

  // Функция для обновления заголовка колонки memory_data
  const updateMemoryDataColumnTitle = (index: number, title: string) => {
    setConfig(prev => {
      const columns = prev.content.memory_data_columns || [];
      const updatedColumns = [...columns];
      if (updatedColumns[index]) {
        updatedColumns[index] = { ...updatedColumns[index], title };
      }
      
      return {
        ...prev,
        content: {
          ...prev.content,
          memory_data_columns: updatedColumns
        }
      };
    });
  };

  // Функция для обновления значения колонки memory_data
  const updateMemoryDataColumnValue = (index: number, value: string) => {
    setConfig(prev => {
      const columns = prev.content.memory_data_columns || [];
      const updatedColumns = [...columns];
      if (updatedColumns[index]) {
        updatedColumns[index] = { ...updatedColumns[index], value };
      }
      
      return {
        ...prev,
        content: {
          ...prev.content,
          memory_data_columns: updatedColumns
        }
      };
    });
  };

  // Функция для добавления колонки format_answer
  const addFormatAnswerColumn = () => {
    setConfig(prev => {
      const columns = prev.content.format_answer_columns || [];
      return {
        ...prev,
        content: {
          ...prev.content,
          format_answer_columns: [...columns, { title: `Колонка ${columns.length + 1}`, value: '' }]
        }
      };
    });
  };

  // Функция для удаления колонки format_answer
  const removeFormatAnswerColumn = (index: number) => {
    setConfig(prev => {
      const columns = prev.content.format_answer_columns || [];
      if (columns.length <= 1) return prev; // Не удаляем последнюю колонку
      
      return {
        ...prev,
        content: {
          ...prev.content,
          format_answer_columns: columns.filter((_, i) => i !== index)
        }
      };
    });
  };

  // Функция для обновления заголовка колонки format_answer
  const updateFormatAnswerColumnTitle = (index: number, title: string) => {
    setConfig(prev => {
      const columns = prev.content.format_answer_columns || [];
      const updatedColumns = [...columns];
      if (updatedColumns[index]) {
        updatedColumns[index] = { ...updatedColumns[index], title };
      }
      
      return {
        ...prev,
        content: {
          ...prev.content,
          format_answer_columns: updatedColumns
        }
      };
    });
  };

  // Функция для обновления значения колонки format_answer
  const updateFormatAnswerColumnValue = (index: number, value: string) => {
    setConfig(prev => {
      const columns = prev.content.format_answer_columns || [];
      const updatedColumns = [...columns];
      if (updatedColumns[index]) {
        updatedColumns[index] = { ...updatedColumns[index], value };
      }
      
      return {
        ...prev,
        content: {
          ...prev.content,
          format_answer_columns: updatedColumns
        }
      };
    });
  };

  return (
    <motion.div 
      className="min-h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Футуристическая декоративная сетка */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-full h-full grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-10">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-emerald-400/20" />
          ))}
        </div>
        {/* Анимированная сфера вверху справа */}
        <div className="absolute top-5 right-16">
          <div className="w-16 h-16 border border-emerald-400/40 rounded-full relative">
            <div className="absolute inset-1 border border-emerald-400/20 rounded-full animate-pulse" />
            <div className="absolute inset-3 border border-emerald-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-5 border border-emerald-400/80 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 rounded-full bg-emerald-400/5 blur-md" />
          </div>
        </div>
        {/* Анимированный квадрат внизу слева */}
        <div className="absolute bottom-10 left-10">
          <div className="w-20 h-20 border border-emerald-400/40 relative animate-futuristicSquare">
            <div className="absolute inset-1 border border-emerald-400/20 animate-pulse rounded-md" />
            <div className="absolute inset-3 border border-emerald-400/60 animate-pulse rounded-md" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-5 border border-emerald-400/80 animate-pulse rounded-md" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 rounded-md bg-emerald-400/5 blur-md" />
          </div>
        </div>
      </div>

      {/* Верхняя панель: заголовок и поле */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-slate-700/50 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent font-neuropol whitespace-pre-line min-w-[180px]">
            Визуальный редактор
          </h2>
          <div className="relative group min-w-[140px] max-w-xs w-full sm:w-auto">
            <input
              type="text"
              placeholder="Имя конфигурации"
              className="w-full px-4 py-2 futuristic-input bg-slate-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/50 pl-4 font-tektur transition-all group-hover:bg-slate-700/40 mb-2 sm:mb-0"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
            />
            <div className="absolute top-0 left-0 w-1 h-0 bg-emerald-400/60 group-hover:h-full transition-all duration-300"></div>
          </div>
        </div>
        {/* Пустой div для выравнивания крестика справа */}
        <div className="hidden sm:block w-48"></div>
      </div>
      {/* Второй ряд: кнопки */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full px-6 pb-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => exportToJson()}
          className="futuristic-btn min-w-[140px] max-w-xs w-full sm:w-auto px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 group font-neuropol"
        >
          <FileJson className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          <span className="truncate font-neuropol">Экспорт JSON</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImport}
          className="futuristic-btn min-w-[140px] max-w-xs w-full sm:w-auto px-4 py-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 group font-neuropol"
        >
          <Upload className="w-5 h-5 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          <span className="truncate font-neuropol">Импорт</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={saveConfig}
          className="futuristic-btn min-w-[140px] max-w-xs w-full sm:w-auto px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 relative overflow-hidden font-neuropol"
        >
          <Save className="w-5 h-5 relative z-10 flex-shrink-0" />
          <span className="relative z-10 truncate font-neuropol">Сохранить</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/50 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity" style={{animation: "bgPulse 2s ease-in-out infinite alternate"}} />
        </motion.button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileSelect}
      />

      <div className="w-full relative z-10 px-6 mt-6"> {/* Добавлен класс mt-6 для отступа сверху */}
        {/* Анимация перехода между табами */}
        <AnimatePresence>
          {tabTransition && (
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Горизонтальные сканирующие линии */}
              <motion.div 
                className="absolute top-[18%] left-0 right-0 h-[1px] bg-emerald-400/80" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[24%] left-0 right-0 h-[1px] bg-emerald-400/60" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.7, ease: "easeInOut", delay: 0.1 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[30%] left-0 right-0 h-[1px] bg-emerald-400/70" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.6, ease: "easeInOut", delay: 0.05 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[36%] left-0 right-0 h-[1px] bg-emerald-400/75" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.8, ease: "easeInOut", delay: 0.2 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[42%] left-0 right-0 h-[1px] bg-emerald-400/70" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.7, ease: "easeInOut", delay: 0.15 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[48%] left-0 right-0 h-[1px] bg-emerald-400/60" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.6, ease: "easeInOut", delay: 0.25 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[54%] left-0 right-0 h-[1px] bg-emerald-400/70" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[60%] left-0 right-0 h-[1px] bg-emerald-400/80" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.6, ease: "easeInOut", delay: 0.2 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[66%] left-0 right-0 h-[1px] bg-emerald-400/75" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.7, ease: "easeInOut", delay: 0.12 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[72%] left-0 right-0 h-[1px] bg-emerald-400/70" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.18 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[78%] left-0 right-0 h-[1px] bg-emerald-400/65" 
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: 1, x: "100%" }}
                transition={{ duration: 2.6, ease: "easeInOut", delay: 0.08 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              <motion.div 
                className="absolute top-[84%] left-0 right-0 h-[1px] bg-emerald-400/80" 
                initial={{ scaleX: 0, x: "100%" }}
                animate={{ scaleX: 1, x: "-100%" }}
                transition={{ duration: 2.8, ease: "easeInOut", delay: 0.22 }}
                style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }}
              />
              
              {/* Цифровые частицы */}
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400/80 rounded-full"
                    initial={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%", 
                      scale: 0,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%", 
                      scale: [0, 1, 1.5, 0],
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 0.6 + Math.random() * 0.4,
                      delay: Math.random() * 0.3,
                      ease: "easeOut"
                    }}
                    style={{ boxShadow: "0 0 5px rgba(52,211,153,0.8)" }}
                  />
                ))}
              </motion.div>
              
              {/* Цифровая сетка (кибер-стиль) */}
              <motion.div 
                className="absolute inset-0 opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(10,1fr)]">
                  {Array.from({ length: 200 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="border border-emerald-400/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: Math.random() > 0.7 ? 0.8 : 0.1 }}
                      transition={{ 
                        duration: 0.2,
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Футуристическая вспышка */}
              <motion.div 
                className="absolute inset-0 bg-emerald-400/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.8 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs
          selectedIndex={activeTab}
          onSelect={handleTabChange}
          className="w-full"
        >
          <TabList className="flex border-b border-slate-700/50 mb-6">
            <Tab
              className={`px-4 py-2 focus:outline-none font-neuropol cursor-pointer relative transition-all duration-300 ${
                activeTab === 0
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <span className="relative z-10">Настройки бота</span>
              {activeTab === 0 && (
                <>
                  {/* Футуристическая анимация активного таба */}
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400/80"
                  />
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 0.5 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute -bottom-[2px] left-0 h-[2px] bg-emerald-400"
                    style={{ 
                      boxShadow: "0 0 8px rgba(52,211,153,0.8), 0 0 16px rgba(52,211,153,0.4)", 
                      filter: "blur(1px)" 
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-1 bg-emerald-400/5 rounded-lg -z-10"
                  />
                  {/* Анимированные точки */}
                  <motion.div 
                    className="absolute bottom-0 left-[10%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[30%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[50%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 0.6 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[70%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", delay: 0.9 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[90%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatType: "loop", delay: 1.2 }}
                  />
                </>
              )}
            </Tab>
            <Tab
              className={`px-4 py-2 focus:outline-none font-neuropol cursor-pointer relative transition-all duration-300 ${
                activeTab === 1
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <span className="relative z-10">Стадии</span>
              {activeTab === 1 && (
                <>
                  {/* Футуристическая анимация активного таба */}
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400/80"
                  />
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 0.5 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute -bottom-[2px] left-0 h-[2px] bg-emerald-400"
                    style={{ 
                      boxShadow: "0 0 8px rgba(52,211,153,0.8), 0 0 16px rgba(52,211,153,0.4)", 
                      filter: "blur(1px)" 
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-1 bg-emerald-400/5 rounded-lg -z-10"
                  />
                  {/* Анимированные точки */}
                  <motion.div 
                    className="absolute bottom-0 left-[10%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[30%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[50%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "loop", delay: 0.6 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[70%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", delay: 0.9 }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-[90%] h-1 w-1 rounded-full bg-emerald-400"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatType: "loop", delay: 1.2 }}
                  />
                </>
              )}
            </Tab>
          </TabList>

          <TabPanel>
            <div className="space-y-6 font-tektur">
              {/* Company Panel */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 relative">
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-emerald-400/20"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-emerald-400/20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-emerald-400/20"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-emerald-400/20"></div>
              
                <h3 className="text-2xl font-tektur font-bold mb-4">Company</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Language
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.lang}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, lang: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Название компании
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.company_name}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, company_name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Бизнес компании
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.company_business || ''}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, company_business: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Тип разговора
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.conversation_type || ''}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, conversation_type: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Стиль ответов
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.answer_style || ''}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, answer_style: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Имя продавца
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.salesperson_name}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, salesperson_name: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Пол продавца
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.salesperson_gender}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, salesperson_gender: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Роль продавца
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.salesperson_role}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, salesperson_role: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Продукт
                    </label>
                    <AutoResizeTextarea
                      className="w-full futuristic-input rounded-lg p-2 text-sm"
                      value={config.company.product}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        company: { ...prev.company, product: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Config Panel */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 relative">
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-emerald-400/20"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-emerald-400/20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-emerald-400/20"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-emerald-400/20"></div>
                
                <h3 className="text-2xl font-tektur font-bold mb-4">Config</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Интервал проверки пробуждения (сек)
                    </label>
                    <input
                      type="number"
                      className="w-full futuristic-input rounded-lg p-2 text-sm bg-slate-700/30"
                      value={config.config.wakeup_check_interval || 30}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        config: { ...prev.config, wakeup_check_interval: parseInt(e.target.value) || 30 }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Интервал паузы сообщения (сек)
                    </label>
                    <input
                      type="number"
                      className="w-full futuristic-input rounded-lg p-2 text-sm bg-slate-700/30"
                      value={config.config.message_pause_interval || 30}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        config: { ...prev.config, message_pause_interval: parseInt(e.target.value) || 30 }
                      }))}
                    />
                  </div>
                </div>
                
                {/* Memory Data - множественное поле с возможностью добавления/удаления колонок */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-base font-semibold text-slate-400">
                        Memory Data
                      </label>
                      <button
                        onClick={addMemoryDataColumn}
                        className="px-2 py-1 bg-emerald-400/10 text-emerald-400 rounded-md text-xs hover:bg-emerald-400/20 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Добавить колонку
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {(config.content.memory_data_columns || []).map((column, index) => (
                        <div key={index} className="relative">
                          <AutoResizeTextarea
                            className="w-full futuristic-input rounded-lg p-2 text-sm bg-slate-700/30 pr-8"
                            placeholder={`Заголовок колонки ${index + 1}`}
                            value={column.title}
                            onChange={e => updateMemoryDataColumnTitle(index, e.target.value)}
                          />
                          <button
                            onClick={() => removeMemoryDataColumn(index)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Удаляем поле memory_data */}
                  </div>

                  {/* Format Answer - множественное поле с возможностью добавления/удаления колонок */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-base font-semibold text-slate-400">
                        Format Answer
                      </label>
                      <button
                        onClick={addFormatAnswerColumn}
                        className="px-2 py-1 bg-emerald-400/10 text-emerald-400 rounded-md text-xs hover:bg-emerald-400/20 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Добавить колонку
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {(config.content.format_answer_columns || []).map((column, index) => (
                        <div key={index} className="relative">
                          <AutoResizeTextarea
                            className="w-full futuristic-input rounded-lg p-2 text-sm bg-slate-700/30 pr-8"
                            placeholder={`Заголовок колонки ${index + 1}`}
                            value={column.title}
                            onChange={e => updateFormatAnswerColumnTitle(index, e.target.value)}
                          />
                          <button
                            onClick={() => removeFormatAnswerColumn(index)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Удаляем поле format_answer */}
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Start Command Trigger
                    </label>
                    <input
                      type="text"
                      className="w-full futuristic-input rounded-lg p-2 text-sm bg-slate-700/30"
                      placeholder="/start"
                      value={config.content.start_command_trigger || "/start"}
                      onChange={e => setConfig(prev => ({
                        ...prev,
                        content: { ...prev.content, start_command_trigger: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Единая структура для всех чекбоксов */}
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="format_attempt"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.format_attempt || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, format_attempt: e.target.checked }
                        }))}
                      />
                      <label htmlFor="format_attempt" className="text-sm cursor-pointer w-full">
                        Format Attempt
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="data_command_trigger"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.data_command_trigger || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, data_command_trigger: e.target.checked }
                        }))}
                      />
                      <label htmlFor="data_command_trigger" className="text-sm cursor-pointer w-full">
                        Data Command Trigger
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="semantic_filter"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.semantic_filter || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, semantic_filter: e.target.checked }
                        }))}
                      />
                      <label htmlFor="semantic_filter" className="text-sm cursor-pointer w-full">
                        Semantic Filter
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="message_filter"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.message_filter || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, message_filter: e.target.checked }
                        }))}
                      />
                      <label htmlFor="message_filter" className="text-sm cursor-pointer w-full">
                        Message Filter
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="error_messages"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.error_messages || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, error_messages: e.target.checked }
                        }))}
                      />
                      <label htmlFor="error_messages" className="text-sm cursor-pointer w-full">
                        Error Messages
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="not_safe_compose"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.not_safe_compose || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, not_safe_compose: e.target.checked }
                        }))}
                      />
                      <label htmlFor="not_safe_compose" className="text-sm cursor-pointer w-full">
                        Not Safe Compose
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="public_access"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.public_access || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, public_access: e.target.checked }
                        }))}
                      />
                      <label htmlFor="public_access" className="text-sm cursor-pointer w-full">
                        Public Access
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="test_mode"
                        className="mr-2 h-4 w-4 cursor-pointer appearance-none border border-slate-400 rounded bg-slate-700/30 checked:bg-emerald-400/80 checked:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                        checked={config.config.test_mode || false}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          config: { ...prev.config, test_mode: e.target.checked }
                        }))}
                      />
                      <label htmlFor="test_mode" className="text-sm cursor-pointer w-full">
                        Test Mode
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 relative">
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-emerald-400/20"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-emerald-400/20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-emerald-400/20"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-emerald-400/20"></div>
                
                <h3 className="text-2xl font-tektur font-bold mb-4">Content</h3>
                <div className="space-y-4">
                  {/* Документы и ссылки */}
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Base
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 futuristic-input rounded-lg p-2 text-sm bg-slate-700/30"
                        placeholder="Ссылка на Google Документ с базой знаний"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          if (baseUrl) window.open(baseUrl, '_blank');
                        }}
                        disabled={!baseUrl}
                        className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Открыть
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-slate-400 mb-1">
                      Wakeups
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 futuristic-input rounded-lg p-2 text-sm bg-slate-700/30"
                        placeholder="Ссылка на Google Документ с кастомными вейкапами"
                        value={wakeupsUrl}
                        onChange={(e) => setWakeupsUrl(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          if (wakeupsUrl) window.open(wakeupsUrl, '_blank');
                        }}
                        disabled={!wakeupsUrl}
                        className="px-3 py-1 bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Открыть
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="space-y-4">
              <button
                onClick={addNewStage}
                className="w-full px-4 py-3 futuristic-btn bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400/20 transition-all flex items-center gap-2 justify-center font-neuropol relative overflow-hidden group"
              >
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Добавить новую стадию</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100" style={{animation: "glowScan 2s linear infinite"}} />
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
      
      {/* Декоративный пустой блок внизу для анимированного квадрата */}
      <div className="h-32 w-full relative z-10"></div>
    </motion.div>
  );
}