import React, { useState, useEffect } from 'react';
import { HazardRecord, AlertData } from '../types';
import { getLocalFallbackAlert } from '../data';
import { LineChart, Line, ResponsiveContainer, YAxis, ReferenceLine } from 'recharts';
import { 
  AlertTriangle, 
  Droplets, 
  Wheat, 
  ThermometerSun, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Info,
  Share2,
  Check
} from 'lucide-react';

interface HazardCardProps {
  key?: React.Key;
  record: HazardRecord;
  language: 'english' | 'kiswahili';
}

export function HazardCard({ record, language }: HazardCardProps) {
  const [alertData, setAlertData] = useState<AlertData>(() => getLocalFallbackAlert(record, language));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Update fallback text immediately if language changes (and we don't have AI override yet)
  // Actually, let's keep it simple: switching language resets to local fallback.
  useEffect(() => {
    setAlertData(getLocalFallbackAlert(record, language));
    setErrorMsg(null);
  }, [language, record]);

  const handleShare = async () => {
    const isKiswahili = language === 'kiswahili';
    const shareText = `${isKiswahili ? 'Tahadhari ya Husika' : 'Husika Alert'}: ${alertData.headline}\n${alertData.message}\n\n${isKiswahili ? 'Hatua:' : 'Actions:'}\n${alertData.actions.map(a => '- ' + a).join('\n')}\n\n${isKiswahili ? 'Ukali' : 'Severity'}: ${alertData.severity.toUpperCase()} - ${record.region}, ${record.country}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Husika Alert',
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareStatus(isKiswahili ? 'Imenakiliwa!' : 'Copied!');
        setTimeout(() => setShareStatus(null), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch(window.location.origin + '/api/process-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: record,
          language
        })
      });
      
      if (!response.ok) {
        let errMessage = 'API error';
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch (e) {}
        throw new Error(errMessage);
      }
      
      const data: AlertData = await response.json();
      if (data.severity && data.headline && data.message && Array.isArray(data.actions)) {
        setAlertData(data);
      } else {
        throw new Error('Invalid format');
      }
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMsg(language === 'kiswahili' ? `Imeshindwa: ${errMsg}` : `Failed: ${errMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate': return 'bg-[#E8A33D]/20 text-[#E8A33D] border-[#E8A33D]/30';
      case 'watch': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getHazardIcon = () => {
    switch (record.hazardType) {
      case 'drought': return <ThermometerSun className="w-6 h-6 text-[#E8A33D]" />;
      case 'flood': return <Droplets className="w-6 h-6 text-blue-400" />;
      case 'food_security': return <Wheat className="w-6 h-6 text-[#6FBF9B]" />;
    }
  };

  const isKiswahili = language === 'kiswahili';

  return (
    <div className="bg-[#123244] border border-white/10 rounded-xl overflow-hidden flex flex-col transition-all">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-[#0B2430] rounded-lg border border-white/5">
              {getHazardIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-[#F3EFE4] leading-tight">{record.region}</h3>
              <p className="text-sm text-white/50">{record.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title={isKiswahili ? 'Shiriki' : 'Share'}
              className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white/90 transition-colors flex items-center justify-center relative"
            >
              {shareStatus ? <Check className="w-4 h-4 text-[#6FBF9B]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <div className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded border ${getSeverityColors(alertData.severity)}`}>
              {alertData.severity}
            </div>
          </div>
        </div>

        {/* Headline & Message */}
        <div className="mb-5">
          <h4 className="text-lg font-bold text-[#F3EFE4] mb-2">{alertData.headline}</h4>
          <p className="text-[#F3EFE4]/80 text-sm leading-relaxed">{alertData.message}</p>
        </div>

        {/* Actions */}
        <div className="mb-5">
          <h5 className="text-xs font-bold text-[#F3EFE4]/50 uppercase tracking-wider mb-2">
            {isKiswahili ? 'Nini cha Kufanya:' : 'What to do:'}
          </h5>
          <ul className="space-y-2">
            {alertData.actions.map((action, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-[#F3EFE4]/90 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6FBF9B] mt-1.5 shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Raw Data Toggle */}
      <div className="border-t border-white/5 bg-[#0B2430]/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-white/60 hover:text-white/90 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            {isKiswahili ? 'Onyesha Data Asili' : 'Show Raw Data'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="px-5 pb-4 space-y-4">
            <div className="text-xs font-mono text-white/70 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white/40">Indicator:</span>
                <span className="text-right text-[#F3EFE4]">{record.indicatorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Value:</span>
                <span className="text-right text-[#F3EFE4]">{record.value} {record.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Threshold:</span>
                <span className="text-right text-[#F3EFE4]">{record.threshold} {record.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Status:</span>
                <span className="text-right text-[#F3EFE4]">{record.triggerStatus.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Trend:</span>
                <span className="text-right text-[#F3EFE4]">{record.trend}</span>
              </div>
            </div>
            
            {record.history && record.history.length > 0 && (
              <div className="h-16 w-full pt-2 border-t border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={record.history}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <ReferenceLine y={Number(record.threshold)} stroke="#E8A33D" strokeDasharray="3 3" opacity={0.5} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6FBF9B" 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Button */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#123244]">
        {errorMsg ? (
          <span className="text-xs text-red-400 max-w-[60%] line-clamp-2" title={errorMsg}>{errorMsg}</span>
        ) : (
          <span className="text-xs text-white/40">
            {isGenerating 
              ? (isKiswahili ? 'Inazalisha...' : 'Generating...') 
              : (isKiswahili ? 'Tahadhari ya kienyeji (Fallback)' : 'Local fallback alert')}
          </span>
        )}
        
        <button 
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0B2430] hover:bg-[#6FBF9B]/20 text-[#6FBF9B] border border-[#6FBF9B]/30 rounded text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isKiswahili ? 'Zalisha kwa AI' : 'Regenerate with AI'}
        </button>
      </div>
    </div>
  );
}
