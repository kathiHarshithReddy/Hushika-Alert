import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { HazardRecord } from '../types';

interface DailySummaryBannerProps {
  records: HazardRecord[];
  language: 'english' | 'kiswahili';
}

export function DailySummaryBanner({ records, language }: DailySummaryBannerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchSummary() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(window.location.origin + '/api/daily-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: records,
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

        const data = await response.json();
        if (isMounted) {
          setSummary(data.summary);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (records.length > 0) {
      fetchSummary();
    } else {
      setIsLoading(false);
      setSummary(language === 'kiswahili' ? 'Hakuna data iliyopatikana.' : 'No data available.');
    }

    return () => {
      isMounted = false;
    };
  }, [records, language]);

  return (
    <div className="bg-[#123244] border-l-4 border-[#E8A33D] rounded-r-lg p-4 mb-8 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-[#E8A33D]" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-[#F3EFE4] mb-1">
            {language === 'kiswahili' ? 'Muhtasari wa Leo' : 'Daily Summary'}
          </h3>
          <div className="text-sm text-white/70">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#E8A33D]" />
                <span>{language === 'kiswahili' ? 'Inazalisha muhtasari kwa AI...' : 'Generating AI summary...'}</span>
              </div>
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <p>{summary}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
