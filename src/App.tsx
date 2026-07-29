import React, { useState } from 'react';
import { hazardRecords } from './data';
import { HazardCard } from './components/HazardCard';
import { HazardMap } from './components/HazardMap';
import { DailySummaryBanner } from './components/DailySummaryBanner';
import { HazardType } from './types';
import { Globe, ShieldAlert, Filter, Languages, Search, FileDown } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'english' | 'kiswahili'>('english');
  const [filter, setFilter] = useState<HazardType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = hazardRecords.filter(r => {
    const matchesFilter = filter === 'all' || r.hazardType === filter;
    const matchesSearch = 
      r.region.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isKiswahili = language === 'kiswahili';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B2430] text-[#F3EFE4] font-sans selection:bg-[#E8A33D]/30 print:bg-white print:text-black">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-[#0B2430]/90 backdrop-blur sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E8A33D] text-[#0B2430] rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Husika Alert</h1>
              <p className="text-xs text-white/50 hidden sm:block">
                Raw hazard signals, turned into plain-language early warnings
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setLanguage(lang => lang === 'english' ? 'kiswahili' : 'english')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <Languages className="w-4 h-4 text-[#6FBF9B]" />
            {isKiswahili ? 'EN / SW' : 'SW / EN'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        <DailySummaryBanner records={hazardRecords} language={language} />
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 print:text-black">
            {isKiswahili ? 'Tahadhari za Hivi Punde' : 'Active Early Warnings'}
          </h2>
          <p className="text-white/60 mb-6 max-w-2xl print:text-gray-700">
            {isKiswahili 
              ? 'Tafsiri ya data ya kiufundi ya hali ya hewa kuwa taarifa nyepesi. Bonyeza "Zalisha kwa AI" kwa uchambuzi wa kina.'
              : 'Translating technical climate data into actionable community alerts. Click "Regenerate with AI" on any card for a nuanced analysis.'}
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
              {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/40" />
              </div>
              <input
                type="text"
                placeholder={isKiswahili ? 'Tafuta mkoa au nchi...' : 'Search region or country...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#123244] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-[#F3EFE4] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div 
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label={isKiswahili ? "Chuja kwa aina ya hatari" : "Filter by hazard type"}
            >
              <div className="flex items-center gap-2 mr-2 text-white/40 sm:hidden" aria-hidden="true">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Filter</span>
              </div>
              {(['all', 'drought', 'flood', 'food_security'] as const).map(type => {
                const isActive = filter === type;
                const label = type === 'all' 
                  ? (isKiswahili ? 'Zote' : 'All Hazards')
                  : type === 'drought' ? (isKiswahili ? 'Ukame' : 'Drought')
                  : type === 'flood' ? (isKiswahili ? 'Mafuriko' : 'Flood')
                  : (isKiswahili ? 'Usalama wa Chakula' : 'Food Security');
                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    aria-pressed={isActive}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:ring-offset-2 focus:ring-offset-[#0B2430] ${
                      isActive 
                        ? 'bg-[#E8A33D] text-[#0B2430]' 
                        : 'bg-[#123244] text-[#F3EFE4]/80 hover:bg-[#123244]/80 border border-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Download Report Button */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#123244] hover:bg-[#123244]/80 text-[#6FBF9B] border border-[#6FBF9B]/30 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <FileDown className="w-4 h-4" />
            {isKiswahili ? 'Pakua Ripoti' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="print:hidden">
        <HazardMap records={filteredRecords} language={language} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:block">
        {filteredRecords.map(record => (
          <HazardCard key={record.id} record={record} language={language} />
        ))}
      </div>
    </main>

    {/* Footer */}
    <footer className="border-t border-white/10 mt-12 py-8 bg-[#0B2430] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/40">
          <Globe className="w-5 h-5 mx-auto mb-3 opacity-50" />
          <p className="max-w-3xl mx-auto">
            {isKiswahili 
              ? 'Kumbuka: Mfumo huu ni wa majaribio (hackathon prototype). Data inatumika kwa mfano tu na sio taarifa halisi ya moja kwa moja. Muundo wa data umeiga mifumo ya ICPAC (Hazard Watch, Drought Watch).' 
              : 'Disclaimer: This is a hackathon prototype. The data structure is modeled on ICPAC\'s public Hazard Watch, Drought Watch, and Thresholds & Triggers systems, using sample data (not a live production feed).'}
          </p>
        </div>
      </footer>
    </div>
  );
}

