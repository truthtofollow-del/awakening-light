import React from 'react';

interface TheNavBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TheNavBar: React.FC<TheNavBarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-4">
        <button
          onClick={() => setCurrentTab('sanctuary')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentTab === 'sanctuary'
              ? 'bg-amber-500 text-white'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Sanctuary
        </button>
        <button
          onClick={() => setCurrentTab('circles')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentTab === 'circles'
              ? 'bg-amber-500 text-white'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Circles
        </button>
      </div>
    </nav>
  );
};

export default TheNavBar;
