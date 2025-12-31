import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ExplorationNav } from './components/ExplorationNav';
import { HeroSection } from './components/HeroSection';
import { CareerPathSection } from './components/CareerPathSection';
import { SpecimenSection } from './components/SpecimenSection';
import { StartExploration } from './components/StartExploration';
import { UserIntentScreen } from './components/UserIntentScreen';
import { AttentionQuestion } from './components/AttentionQuestion';
import { LearningStyleQuestion } from './components/LearningStyleQuestion';
import { WorkProximityQuestion } from './components/WorkProximityQuestion';
import { DragDropEnergyQuestion } from './components/DragDropEnergyQuestion';
import { PrioritiesQuestion } from './components/PrioritiesQuestion';
import { WorkFrequencyQuestion } from './components/WorkFrequencyQuestion';
import { GrowthDesiresQuestion } from './components/GrowthDesiresQuestion';
import { CuriousInterestsQuestion } from './components/CuriousInterestsQuestion';
import { MessyInboxGame } from './components/MessyInboxGame';
import { AdviceVoicesGame } from './components/AdviceVoicesGame';
import { AbstractShapesGame } from './components/AbstractShapesGame';
import { SituationalChoicesGame } from './components/SituationalChoicesGame';
import { LoadingScreen } from './components/LoadingScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { BubbleResults } from './components/BubbleResults';
import { useExplorationStore } from './store/explorationStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'start' | 'intent' | 'attention' | 'learning' | 'workProximity' | 'energyDragDrop' | 'priorities' | 'workFrequency' | 'growthDesires' | 'curiousInterests' | 'messyInboxGame' | 'adviceVoicesGame' | 'abstractShapesGame' | 'situationalChoicesGame' | 'loading' | 'completion' | 'results'>('landing');
  const { setIntent, resetExploration, intent } = useExplorationStore();

  const handleBack = () => {
    if (currentScreen === 'messyInboxGame' || currentScreen === 'adviceVoicesGame' || currentScreen === 'abstractShapesGame' || currentScreen === 'situationalChoicesGame' || currentScreen === 'loading' || currentScreen === 'completion' || currentScreen === 'results') {
      // Can't go back from the games or results
      return;
    } else if (currentScreen === 'curiousInterests') {
      setCurrentScreen('intent');
    } else if (currentScreen === 'growthDesires') {
      setCurrentScreen('workFrequency');
    } else if (currentScreen === 'workFrequency') {
      setCurrentScreen('intent');
    } else if (currentScreen === 'priorities') {
      setCurrentScreen('energyDragDrop');
    } else if (currentScreen === 'energyDragDrop') {
      setCurrentScreen('workProximity');
    } else if (currentScreen === 'workProximity') {
      setCurrentScreen('intent');
    } else if (currentScreen === 'learning') {
      setCurrentScreen('attention');
    } else if (currentScreen === 'attention') {
      setCurrentScreen('intent');
    } else if (currentScreen === 'intent') {
      setCurrentScreen('start');
    } else if (currentScreen === 'start') {
      setCurrentScreen('landing');
    }
  };

  const handleExit = () => {
    setCurrentScreen('landing');
    resetExploration();
  };

  if (currentScreen === 'messyInboxGame') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onExit={handleExit}
          showBack={false}
        />
        <MessyInboxGame 
          onNext={() => {
            setCurrentScreen('adviceVoicesGame');
          }}
          currentStep={1}
          totalSteps={4}
        />
      </div>
    );
  }

  if (currentScreen === 'adviceVoicesGame') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onExit={handleExit}
          showBack={false}
        />
        <AdviceVoicesGame 
          onNext={() => {
            setCurrentScreen('abstractShapesGame');
          }} 
          currentStep={2}
          totalSteps={4}
        />
      </div>
    );
  }

  if (currentScreen === 'abstractShapesGame') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onExit={handleExit}
          showBack={false}
        />
        <AbstractShapesGame 
          onNext={() => {
            setCurrentScreen('situationalChoicesGame');
          }} 
          currentStep={3}
          totalSteps={4}
        />
      </div>
    );
  }

  if (currentScreen === 'situationalChoicesGame') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onExit={handleExit}
          showBack={false}
        />
        <SituationalChoicesGame 
          onNext={() => {
            setCurrentScreen('completion');
          }} 
          currentStep={4}
          totalSteps={4}
        />
      </div>
    );
  }

  if (currentScreen === 'completion') {
    return <CompletionScreen onContinue={() => setCurrentScreen('loading')} />;
  }

  if (currentScreen === 'loading') {
    return <LoadingScreen onComplete={() => setCurrentScreen('results')} delay={3000} />;
  }

  if (currentScreen === 'results') {
    return <BubbleResults onBack={handleExit} />;
  }

  if (currentScreen === 'curiousInterests') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <CuriousInterestsQuestion onNext={() => {
          setCurrentScreen('messyInboxGame');
        }} />
      </div>
    );
  }

  if (currentScreen === 'growthDesires') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <GrowthDesiresQuestion onNext={() => {
          setCurrentScreen('messyInboxGame');
        }} />
      </div>
    );
  }

  if (currentScreen === 'workFrequency') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <WorkFrequencyQuestion onNext={() => {
          setCurrentScreen('growthDesires');
        }} />
      </div>
    );
  }

  if (currentScreen === 'priorities') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <PrioritiesQuestion onNext={() => {
          setCurrentScreen('messyInboxGame');
        }} />
      </div>
    );
  }

  if (currentScreen === 'energyDragDrop') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <DragDropEnergyQuestion onNext={() => {
          setCurrentScreen('priorities');
        }} />
      </div>
    );
  }

  if (currentScreen === 'workProximity') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <WorkProximityQuestion onNext={() => {
          setCurrentScreen('energyDragDrop');
        }} />
      </div>
    );
  }

  if (currentScreen === 'learning') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <LearningStyleQuestion onNext={() => {
          setCurrentScreen('messyInboxGame');
        }} />
      </div>
    );
  }

  if (currentScreen === 'attention') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <AttentionQuestion onNext={() => {
          setCurrentScreen('learning');
        }} />
      </div>
    );
  }

  if (currentScreen === 'intent') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onBack={handleBack}
          onExit={handleExit}
          showBack={true}
        />
        <UserIntentScreen onNext={(intent) => {
          // Map user selections to intent types
          const intentMap: Record<string, 'explore' | 'pivot' | 'growth' | 'curious'> = {
            'starting': 'explore',
            'shifting': 'pivot',
            'growing': 'growth',
            'curious': 'curious'
          };
          
          setIntent(intentMap[intent] || 'explore');
          if (intentMap[intent] === 'pivot') {
            setCurrentScreen('workProximity');
          } else if (intentMap[intent] === 'growth') {
            setCurrentScreen('workFrequency');
          } else if (intentMap[intent] === 'curious') {
            setCurrentScreen('curiousInterests');
          } else {
            setCurrentScreen('attention');
          }
        }} />
      </div>
    );
  }

  if (currentScreen === 'start') {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          fontFamily: 'var(--font-body)',
          backgroundColor: '#ffffff'
        }}
      >
        <ExplorationNav 
          onExit={handleExit}
          showBack={false}
        />
        <StartExploration onStart={() => setCurrentScreen('intent')} />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        fontFamily: 'var(--font-body)',
        backgroundColor: '#ffffff'
      }}
    >
      <Navbar />
      <HeroSection onTryNow={() => setCurrentScreen('start')} />
      <CareerPathSection />
      <SpecimenSection />
    </div>
  );
}