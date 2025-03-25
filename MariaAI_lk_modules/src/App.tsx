import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { AccessibilityControls } from './components/layout/AccessibilityControls';
import { CommandPalette } from './components/layout/CommandPalette';

// Section Components
import { Dashboard } from './components/sections/Dashboard';
import { Conversations } from './components/sections/Conversations';
import { WorkflowSection } from './components/sections/Workflow';
import { Knowledge } from './components/sections/Knowledge';
import { Performance } from './components/sections/Performance';

// Predictive Components
import { PredictivePrompt } from './components/predictive/PredictivePrompt';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [predictedAction, setPredictedAction] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    favoriteSection: 'dashboard',
    commonActions: [] as string[],
    timePatterns: {} as Record<string, string>,
  });

  // Simulate AI learning from user behavior
  useEffect(() => {
    const hour = new Date().getHours();
    
    // Predict user needs based on time of day
    if (hour >= 9 && hour <= 11) {
      setPredictedAction('morning_report');
    } else if (hour >= 14 && hour <= 16) {
      setPredictedAction('performance_check');
    } else if (hour >= 16 && hour <= 18) {
      setPredictedAction('daily_summary');
    }
  }, []);

  // Accessibility features
  useEffect(() => {
    // Simulate AI detecting user needs
    const detectAccessibilityNeeds = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersDark) setTheme('dark');
      // Adjust font size based on screen distance (simulated)
      const simulatedDistance = Math.random() > 0.5;
      if (simulatedDistance) setFontSize((prev) => prev + 2);
    };

    detectAccessibilityNeeds();
  }, []);

  const handleCardClick = (id: string) => {
    setSelectedCard(id);
    setShowRightPanel(true);
    
    // Record user action for learning
    setLastAction(id);
    setUserPreferences(prev => ({
      ...prev,
      commonActions: [...prev.commonActions, id].slice(-5)
    }));
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'conversations':
        return <Conversations onCardClick={handleCardClick} />;
      case 'workflow':
        return <WorkflowSection onCardClick={handleCardClick} />;
      case 'knowledge':
        return <Knowledge onCardClick={handleCardClick} />;
      case 'performance':
        return <Performance onCardClick={handleCardClick} />;
      default:
        return (
          <Dashboard 
            onCardClick={handleCardClick}
            setShowCommandPalette={setShowCommandPalette}
          />
        );
    }
  };

  return (
    <div className={`flex h-screen bg-gradient-to-br ${
      theme === 'dark' 
        ? 'from-slate-900 to-slate-800' 
        : 'from-slate-100 to-white'
    } ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8" style={{ fontSize: `${fontSize}px` }}>
          {renderMainContent()}
        </div>
      </main>

      <AnimatePresence>
        {showRightPanel && (
          <RightPanel
            selectedCard={selectedCard}
            onClose={() => setShowRightPanel(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette
            showCommandPalette={showCommandPalette}
            predictedAction={predictedAction}
            userPreferences={userPreferences}
          />
        )}
      </AnimatePresence>

      <AccessibilityControls
        theme={theme}
        setTheme={setTheme}
        setFontSize={setFontSize}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        setContrast={setContrast}
      />

      <AnimatePresence>
        {predictedAction && (
          <PredictivePrompt predictedAction={predictedAction} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;