import React from 'react';
import { Moon, Sun, ZoomIn, Volume2, VolumeX, Palette } from 'lucide-react';

interface AccessibilityControlsProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (cb: (prev: number) => number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setContrast: (cb: (prev: number) => number) => void;
}

export function AccessibilityControls({
  theme,
  setTheme,
  setFontSize,
  soundEnabled,
  setSoundEnabled,
  setContrast
}: AccessibilityControlsProps) {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg border border-slate-700/50">
      <button
        onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
      <button
        onClick={() => setFontSize(prev => prev + 1)}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => setSoundEnabled(prev => !prev)}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
      <button
        onClick={() => setContrast(prev => prev + 10)}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        <Palette className="w-4 h-4" />
      </button>
    </div>
  );
}