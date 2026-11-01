import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import BirthdayBuilder from './components/builder/BirthdayBuilder';
import ProposalBuilder from './components/builder/ProposalBuilder';
import ApologyBuilder from './components/builder/ApologyBuilder';
import ShowLoveBuilder from './components/builder/ShowLoveBuilder';
import BirthdayExperience from './components/experience/BirthdayExperience';
import ProposalExperience from './components/experience/ProposalExperience';
import ApologyExperience from './components/experience/ApologyExperience';
import ShowLoveExperience from './components/experience/ShowLoveExperience';
import SavedSurprisesModal from './components/SavedSurprisesModal';
import { decodeSurprise, fetchShortSurprise, getSavedSurprises, deleteSurpriseFromHistory } from './utils/compression';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'builder_birthday', 'builder_proposal', 'builder_apology', 'builder_show_love', 'experience'
  const [activeExperienceData, setActiveExperienceData] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedSurprises, setSavedSurprises] = useState([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isLoadingSurprise, setIsLoadingSurprise] = useState(false);

  // Load saved surprises from localStorage
  const refreshSaved = () => {
    setSavedSurprises(getSavedSurprises());
  };

  useEffect(() => {
    refreshSaved();

    // Check if URL has #s=... or #experience=...
    const checkHash = async () => {
      const hash = window.location.hash;
      if (!hash) return;

      // 1. Check for Short Link #s=...
      if (hash.includes('s=')) {
        const shortId = hash.split('s=')[1]?.split('&')[0];
        if (shortId) {
          setIsLoadingSurprise(true);
          const data = await fetchShortSurprise(shortId);
          setIsLoadingSurprise(false);
          if (data) {
            setActiveExperienceData(data);
            setCurrentView('experience');
            setIsPreviewMode(false);
            return;
          }
        }
      }

      // 2. Check for Hash Data #experience=...
      if (hash.includes('experience=')) {
        const hashVal = hash.split('experience=')[1]?.split('&')[0];
        const decoded = decodeSurprise(hashVal);
        if (decoded) {
          setActiveExperienceData(decoded);
          setCurrentView('experience');
          setIsPreviewMode(false);
          return;
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Handle preview from builder
  const handlePreview = (data) => {
    setActiveExperienceData(data);
    setCurrentView('experience');
    setIsPreviewMode(true);
  };

  const handleExitPreview = () => {
    setIsPreviewMode(false);
    if (activeExperienceData?.type === 'proposal') {
      setCurrentView('builder_proposal');
    } else if (activeExperienceData?.type === 'apology') {
      setCurrentView('builder_apology');
    } else if (activeExperienceData?.type === 'show_love') {
      setCurrentView('builder_show_love');
    } else {
      setCurrentView('builder_birthday');
    }
  };

  const handleDeleteSaved = (id) => {
    const updated = deleteSurpriseFromHistory(id);
    setSavedSurprises(updated);
  };

  // If loading surprise from short link
  if (isLoadingSurprise) {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-3xl animate-bounce mb-4">
          💌
        </div>
        <h2 className="text-xl font-bold text-slate-800">Opening your surprise...</h2>
        <p className="text-xs text-slate-500 mt-1">Preparing the experience with love ✨</p>
      </div>
    );
  }

  // If in recipient experience view
  if (currentView === 'experience' && activeExperienceData) {
    if (activeExperienceData.type === 'proposal') {
      return (
        <ProposalExperience
          data={activeExperienceData}
          isPreview={isPreviewMode}
          onExitPreview={handleExitPreview}
        />
      );
    }
    if (activeExperienceData.type === 'apology') {
      return (
        <ApologyExperience
          data={activeExperienceData}
          isPreview={isPreviewMode}
          onExitPreview={handleExitPreview}
        />
      );
    }
    if (activeExperienceData.type === 'show_love') {
      return (
        <ShowLoveExperience
          data={activeExperienceData}
          isPreview={isPreviewMode}
          onExitPreview={handleExitPreview}
        />
      );
    }
    return (
      <BirthdayExperience
        data={activeExperienceData}
        isPreview={isPreviewMode}
        onExitPreview={handleExitPreview}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        onNavigate={(target) => {
          if (target === 'saved') {
            refreshSaved();
            setIsSavedModalOpen(true);
          } else {
            setCurrentView('home');
          }
        }}
        savedCount={savedSurprises.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            onSelectExperience={(type) => {
              if (type === 'birthday') setCurrentView('builder_birthday');
              if (type === 'apology') setCurrentView('builder_apology');
              if (type === 'proposal') setCurrentView('builder_proposal');
              if (type === 'show_love') setCurrentView('builder_show_love');
            }}
            onOpenHowItWorks={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'builder_birthday' && (
          <BirthdayBuilder
            onBack={() => {
              refreshSaved();
              setCurrentView('home');
            }}
            onPreviewExperience={handlePreview}
          />
        )}

        {currentView === 'builder_apology' && (
          <ApologyBuilder
            onBack={() => {
              refreshSaved();
              setCurrentView('home');
            }}
            onPreviewExperience={handlePreview}
          />
        )}

        {currentView === 'builder_proposal' && (
          <ProposalBuilder
            onBack={() => {
              refreshSaved();
              setCurrentView('home');
            }}
            onPreviewExperience={handlePreview}
          />
        )}

        {currentView === 'builder_show_love' && (
          <ShowLoveBuilder
            onBack={() => {
              refreshSaved();
              setCurrentView('home');
            }}
            onPreviewExperience={handlePreview}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white/60 py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Little Surprise ✨</span>
            <span>•</span>
            <span>Create personal birthday cards, apologies, proposals & love surprises for free</span>
          </div>
          <div>
            Built with love 🎁 • Zero tracking • 100% Free Forever
          </div>
        </div>
      </footer>

      {/* Saved Surprises Modal */}
      <SavedSurprisesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        surprises={savedSurprises}
        onDelete={handleDeleteSaved}
        onPreview={(item) => {
          setActiveExperienceData(item);
          setCurrentView('experience');
          setIsPreviewMode(true);
        }}
      />
    </div>
  );
}
