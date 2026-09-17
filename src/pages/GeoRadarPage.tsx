import React, { useState } from 'react';
import { 
  Globe, Radio, ShieldAlert, Sparkles, Filter, 
  MapPin, TrendingUp, AlertCircle, ArrowUpRight, Activity
} from 'lucide-react';
import { GeoNewsRegion } from '../types';

const INITIAL_REGIONS: GeoNewsRegion[] = [
  {
    id: 'na',
    name: 'North America',
    coordinates: { x: 22, y: 32 },
    activeArticlesCount: 1420,
    sentimentBreakdown: { positive: 42, neutral: 38, negative: 20 },
    geopoliticalRiskScore: 18,
    trendingTopic: 'Frontier AI Governance & Semiconductor Fab Subsidies',
    topHeadline: 'US FTC announces expanded antitrust inquiry into big tech AI chip partnerships',
    status: 'High Activity'
  },
  {
    id: 'eu',
    name: 'Europe & UK',
    coordinates: { x: 50, y: 28 },
    activeArticlesCount: 1180,
    sentimentBreakdown: { positive: 35, neutral: 45, negative: 20 },
    geopoliticalRiskScore: 32,
    trendingTopic: 'Digital Markets Act Enforcement & Clean Energy Grid',
    topHeadline: 'EU Parliament mandates universal battery swap standards for commercial fleets',
    status: 'Stable'
  },
  {
    id: 'ap',
    name: 'Asia-Pacific',
    coordinates: { x: 78, y: 44 },
    activeArticlesCount: 1650,
    sentimentBreakdown: { positive: 50, neutral: 30, negative: 20 },
    geopoliticalRiskScore: 45,
    trendingTopic: 'Next-Gen Silicon Fabs & Autonomous Transit',
    topHeadline: 'Tokyo & Singapore unveil cross-border digital settlement corridor',
    status: 'High Activity'
  },
  {
    id: 'me',
    name: 'Middle East & Africa',
    coordinates: { x: 58, y: 52 },
    activeArticlesCount: 890,
    sentimentBreakdown: { positive: 28, neutral: 35, negative: 37 },
    geopoliticalRiskScore: 68,
    trendingTopic: 'Sovereign AI Infrastructure & Solar Desalination',
    topHeadline: 'UAE expands 500MW solar-powered data center initiative in Dubai',
    status: 'Breaking Incident'
  },
  {
    id: 'latam',
    name: 'Latin America',
    coordinates: { x: 32, y: 68 },
    activeArticlesCount: 640,
    sentimentBreakdown: { positive: 38, neutral: 42, negative: 20 },
    geopoliticalRiskScore: 28,
    trendingTopic: 'Lithium Triangle Supply Chains & Fintech Growth',
    topHeadline: 'Brazil central bank reports record volume in PIX instant payment network',
    status: 'Stable'
  }
];

export default function GeoRadarPage() {
  const [selectedRegionId, setSelectedRegionId] = useState('ap');
  const [activeCategory, setActiveCategory] = useState('All');

  const selectedRegion = INITIAL_REGIONS.find(r => r.id === selectedRegionId) || INITIAL_REGIONS[0];

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <Globe className="w-4 h-4" />
            <span>Geopolitical News Radar</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px]">
              Live Satellite Feeds
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Global <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">GeoRadar</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time geospatial visualization of global news coverage, regional sentiment shifts, breaking hotspots, and geopolitical risk indices.
          </p>
        </div>

        {/* Global Summary Metric Pill */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Global News Velocity</p>
            <p className="text-base font-black text-emerald-400 font-mono">5,780 Stories / hr</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* World Map Radar Container */}
      <div className="rounded-3xl bg-slate-950 border border-white/10 p-6 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Global Geopolitical Heatmap</span>
          </div>
          <span className="text-xs text-slate-400">Click a regional pin to inspect story density</span>
        </div>

        {/* Visual Map Grid */}
        <div className="relative w-full h-[340px] md:h-[420px] rounded-2xl bg-gradient-to-b from-[#0c121e] to-[#080d14] border border-white/10 overflow-hidden flex items-center justify-center">
          
          {/* Map Grid overlay lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Decorative Equator & Prime Meridian lines */}
          <div className="absolute w-full h-[1px] bg-cyan-500/20 top-1/2 left-0" />
          <div className="absolute h-full w-[1px] bg-cyan-500/20 left-1/2 top-0" />

          {/* Interactive Region Pins */}
          {INITIAL_REGIONS.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-10 ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                }`}
              >
                {/* Pulse circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  isSelected 
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/50' 
                    : region.status === 'Breaking Incident' 
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300' 
                    : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Tooltip Label */}
                <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border transition-all shadow-md ${
                  isSelected 
                    ? 'bg-emerald-950 text-emerald-200 border-emerald-500 opacity-100' 
                    : 'bg-slate-900/90 text-slate-300 border-white/10 opacity-70 group-hover:opacity-100'
                }`}>
                  {region.name} ({region.activeArticlesCount})
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Region Detailed Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Region Overview & Trending Story */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Selected Region</span>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  {selectedRegion.name}
                  <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full ${
                    selectedRegion.status === 'High Activity' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    selectedRegion.status === 'Breaking Incident' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {selectedRegion.status}
                  </span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Volume</span>
                <p className="text-xl font-bold font-mono text-emerald-400">{selectedRegion.activeArticlesCount} stories</p>
              </div>
            </div>

            {/* Top Regional Headline */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Top Regional Dispatch
              </span>
              <h3 className="text-base font-bold text-white leading-snug">{selectedRegion.topHeadline}</h3>
              <p className="text-xs text-slate-400">
                Key Driver: <strong className="text-slate-200">{selectedRegion.trendingTopic}</strong>
              </p>
            </div>

            {/* Regional Sentiment Distribution Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>Regional Sentiment Ratio</span>
                <span>
                  Positive: {selectedRegion.sentimentBreakdown.positive}% | 
                  Neutral: {selectedRegion.sentimentBreakdown.neutral}% | 
                  Negative: {selectedRegion.sentimentBreakdown.negative}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 flex overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${selectedRegion.sentimentBreakdown.positive}%` }} 
                />
                <div 
                  className="bg-slate-400 h-full" 
                  style={{ width: `${selectedRegion.sentimentBreakdown.neutral}%` }} 
                />
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${selectedRegion.sentimentBreakdown.negative}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Geopolitical Risk Index Gauge */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Geopolitical Stability Index</span>
            </div>
            <div className="text-4xl font-black font-mono text-white flex items-baseline gap-2">
              {selectedRegion.geopoliticalRiskScore}
              <span className="text-xs font-normal text-slate-400">/ 100 Risk Rating</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Calculated via local policy news volatility, trade dispute indicators, and economic sentiment shifts.
            </p>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${
                selectedRegion.geopoliticalRiskScore > 50 ? 'bg-rose-500' :
                selectedRegion.geopoliticalRiskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${selectedRegion.geopoliticalRiskScore}%` }}
            />
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Status Assessment</span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {selectedRegion.geopoliticalRiskScore > 50
                ? 'Heightened risk levels monitored. Elevated regulatory and diplomatic volatility observed.'
                : 'Stable geopolitical baseline with standard economic market news velocity.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
