import { HazardRecord, AlertData } from './types';

export const hazardRecords: HazardRecord[] = [
  {
    id: '1',
    country: 'India',
    region: 'Rajasthan',
    hazardType: 'drought',
    indicatorName: 'Vegetation Condition Index (VCI)',
    value: 18,
    unit: 'index',
    threshold: 35,
    triggerStatus: 'exceeded',
    trend: 'declining',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: 45 },
      { date: 'Feb', value: 40 },
      { date: 'Mar', value: 32 },
      { date: 'Apr', value: 25 },
      { date: 'May', value: 20 },
      { date: 'Jun', value: 18 },
    ],
    lat: 27.02,
    lng: 74.21,
  },
  {
    id: '2',
    country: 'Afghanistan',
    region: 'Badakhshan',
    hazardType: 'food_security',
    indicatorName: 'IPC Acute Food Insecurity Phase',
    value: 3,
    unit: 'phase',
    threshold: 3,
    triggerStatus: 'at_threshold',
    trend: 'stable',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: 2 },
      { date: 'Feb', value: 3 },
      { date: 'Mar', value: 3 },
      { date: 'Apr', value: 3 },
      { date: 'May', value: 3 },
      { date: 'Jun', value: 3 },
    ],
    lat: 36.73,
    lng: 70.81,
  },
  {
    id: '3',
    country: 'Bangladesh',
    region: 'Sylhet',
    hazardType: 'flood',
    indicatorName: 'River Stage Height',
    value: 4.6,
    unit: 'm',
    threshold: 4.0,
    triggerStatus: 'exceeded',
    trend: 'rising',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: 3.2 },
      { date: 'Feb', value: 3.5 },
      { date: 'Mar', value: 3.8 },
      { date: 'Apr', value: 4.1 },
      { date: 'May', value: 4.4 },
      { date: 'Jun', value: 4.6 },
    ],
    lat: 24.89,
    lng: 91.86,
  },
  {
    id: '4',
    country: 'Pakistan',
    region: 'Balochistan',
    hazardType: 'drought',
    indicatorName: 'Standardized Precipitation Index (SPI-3)',
    value: -1.4,
    unit: 'index',
    threshold: -1.0,
    triggerStatus: 'exceeded',
    trend: 'declining',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: -0.2 },
      { date: 'Feb', value: -0.5 },
      { date: 'Mar', value: -0.8 },
      { date: 'Apr', value: -1.0 },
      { date: 'May', value: -1.2 },
      { date: 'Jun', value: -1.4 },
    ],
    lat: 28.49,
    lng: 65.09,
  },
  {
    id: '5',
    country: 'Vietnam',
    region: 'Mekong Delta',
    hazardType: 'flood',
    indicatorName: 'Inundation Extent Change',
    value: 22,
    unit: '%',
    threshold: 15,
    triggerStatus: 'exceeded',
    trend: 'rising',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: 12 },
      { date: 'Feb', value: 14 },
      { date: 'Mar', value: 16 },
      { date: 'Apr', value: 18 },
      { date: 'May', value: 20 },
      { date: 'Jun', value: 22 },
    ],
    lat: 10.03,
    lng: 105.78,
  },
  {
    id: '6',
    country: 'Mongolia',
    region: 'Gobi Desert',
    hazardType: 'drought',
    indicatorName: 'Water Requirement Satisfaction Index (WRSI)',
    value: 61,
    unit: 'index',
    threshold: 60,
    triggerStatus: 'at_threshold',
    trend: 'stable',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: 'Jan', value: 75 },
      { date: 'Feb', value: 70 },
      { date: 'Mar', value: 65 },
      { date: 'Apr', value: 62 },
      { date: 'May', value: 61 },
      { date: 'Jun', value: 61 },
    ],
    lat: 42.5,
    lng: 103.0,
  }
];

export function getLocalFallbackAlert(record: HazardRecord, language: 'english' | 'kiswahili'): AlertData {
  const isKiswahili = language === 'kiswahili';
  
  let severity: 'severe' | 'moderate' | 'watch' = 'watch';
  if (record.triggerStatus === 'exceeded' && (record.trend === 'rising' || record.trend === 'declining')) {
    severity = 'severe';
  } else if (record.triggerStatus === 'exceeded' || record.triggerStatus === 'at_threshold') {
    severity = 'moderate';
  }

  if (record.hazardType === 'drought') {
    return {
      severity,
      headline: isKiswahili ? 'Tahadhari ya Ukame Kavu' : 'Drought Alert',
      message: isKiswahili 
        ? `Viashiria vya ukame katika ${record.region} vimezidi viwango vya kawaida. Tafadhali chukua tahadhari za mapema kuhifadhi maji.` 
        : `Drought indicators in ${record.region} have crossed critical thresholds. Please take early action to conserve water.`,
      actions: isKiswahili 
        ? ['Hifadhi maji safi', 'Wasiliana na viongozi wa mtaa', 'Fuatilia taarifa zaidi'] 
        : ['Conserve clean water', 'Contact local leaders', 'Monitor further updates']
    };
  }
  
  if (record.hazardType === 'flood') {
    return {
      severity,
      headline: isKiswahili ? 'Tahadhari ya Mafuriko' : 'Flood Alert',
      message: isKiswahili 
        ? `Kiwango cha maji katika ${record.region} kimeongezeka sana. Hatari ya mafuriko ipo karibu.` 
        : `Water levels in ${record.region} are unusually high. There is an imminent risk of flooding.`,
      actions: isKiswahili 
        ? ['Sogeza vitu vyako sehemu za juu', 'Epuka kuvuka mito iliyojaa', 'Kuwa tayari kuhama'] 
        : ['Move belongings to higher ground', 'Avoid crossing flooded rivers', 'Prepare to evacuate']
    };
  }

  // Food Security
  return {
    severity,
    headline: isKiswahili ? 'Tahadhari ya Usalama wa Chakula' : 'Food Security Alert',
    message: isKiswahili 
      ? `Hali ya chakula katika ${record.region} inahitaji uangalizi. Misaada inaweza kuhitajika.` 
      : `The food security situation in ${record.region} requires monitoring. Assistance may be needed.`,
    actions: isKiswahili 
      ? ['Ripoti uhaba wa chakula', 'Tumia chakula vizuri', 'Tafuta msaada kwa asasi'] 
      : ['Report food shortages', 'Ration current supplies', 'Seek assistance from NGOs']
  };
}
