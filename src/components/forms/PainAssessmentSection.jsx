import React, { useState } from 'react';

export default function PainAssessmentSection({ formData, updateFormData }) {
  const painFaces = [
    { score: 10, label: 'WORST POSSIBLE PAIN', color: '#be123c', effect: '😭' },
    { score: 8, label: '', color: '#e11d48', effect: '😢' },
    { score: 6, label: 'SEVERE PAIN', color: '#fb923c', effect: '😩' },
    { score: 5, label: 'MODERATE PAIN', color: '#f59e0b', effect: '☹️' },
    { score: 4, label: '', color: '#fbbf24', effect: '🙁' },
    { score: 2, label: '', color: '#a3e635', effect: '🙂' },
    { score: 0, label: 'NO PAIN', color: '#0ea5e9', effect: '😊' },
  ];

  const handleScoreChange = (score) => {
    updateFormData({ painScore: score });
  };

  const handleQualityToggle = (quality) => {
    const currentQualities = formData.painQualities || [];
    const updatedQualities = currentQualities.includes(quality)
      ? currentQualities.filter(q => q !== quality)
      : [...currentQualities, quality];
    updateFormData({ painQualities: updatedQualities });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Pain Scale (Image 1 Left) */}
        <div className="border-2 border-slate-100 rounded-3xl p-6 bg-slate-50/20">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 text-center underline decoration-primary-500 underline-offset-8">
            Pain Assessment Scale
          </h3>
          
          <div className="flex gap-12 items-center justify-center">
            {/* Thermometer / Scale */}
            <div className="relative w-4 h-80 bg-slate-200 rounded-full overflow-hidden flex flex-col-reverse shadow-inner">
               <div 
                  className="w-full transition-all duration-500 rounded-full" 
                  style={{ 
                    height: `${(formData.painScore || 0) * 10}%`,
                    background: `linear-gradient(to top, #0ea5e9, #f59e0b, #e11d48)`
                  }} 
               />
               {/* Markers */}
               {Array.from({length: 11}).map((_, i) => (
                 <div key={i} className="absolute left-full ml-2 flex items-center" style={{ bottom: `${i * 10}%` }}>
                    <div className="w-2 h-0.5 bg-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 ml-2">{i}</span>
                 </div>
               ))}
            </div>

            {/* Faces */}
            <div className="space-y-2">
              {painFaces.map((face) => (
                <div 
                  key={face.score}
                  onClick={() => handleScoreChange(face.score)}
                  className={`flex items-center gap-4 cursor-pointer group transition-all transform hover:scale-105 ${
                    formData.painScore === face.score ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-3xl shadow-md border-2"
                    style={{ borderColor: face.color, backgroundColor: `${face.color}10` }}
                  >
                    {face.effect}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase leading-none">{face.label}</span>
                    <span className="text-xs font-bold" style={{ color: face.color }}>Score: {face.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body Map Placeholder (Image 1 Right) */}
        <div className="border-2 border-slate-100 rounded-3xl p-6 flex flex-col bg-slate-50/20">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 text-center underline decoration-primary-500 underline-offset-8">
             Body Pain Mapping
           </h3>
           <div className="flex-1 min-h-[400px] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 gap-4">
             <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
               <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
             </div>
             <div>
               <p className="text-slate-600 font-bold uppercase text-[11px] tracking-widest">Pain Map Interface</p>
               <p className="text-slate-400 text-[10px] mt-2 leading-relaxed">
                 Interactive body map for anterior, posterior, and lateral views. <br/>
                 Click to mark areas of pain.
               </p>
             </div>
             <div className="flex gap-2 flex-wrap justify-center mt-4 text-[9px] font-bold text-slate-400">
                <span className="px-2 py-1 bg-slate-100 rounded">ANTERIOR</span>
                <span className="px-2 py-1 bg-slate-100 rounded">POSTERIOR</span>
                <span className="px-2 py-1 bg-slate-100 rounded">LATERAL</span>
             </div>
           </div>
        </div>
      </div>

      {/* Pain Quality & Onset (Image 3) */}
      <div className="card p-8 border-2 border-primary-100 bg-primary-50/10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-black text-primary-700 uppercase tracking-wider mb-4 border-b border-primary-200 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full" /> Pain Quality:
              </h4>
              <div className="flex flex-wrap gap-3">
                {['Dull', 'Aching', 'Sharp', 'Shooting', 'Burning', 'Throbbing', 'Stabbing'].map(q => (
                  <button
                    key={q}
                    onClick={() => handleQualityToggle(q)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      (formData.painQualities || []).includes(q)
                        ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-300 ring-offset-2'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black text-primary-700 uppercase tracking-wider mb-4 border-b border-primary-200 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full" /> Onset:
              </h4>
              <div className="flex flex-wrap gap-3">
                {['Constant', 'Periodic', 'Episodic', 'Occasional'].map(o => (
                  <button
                    key={o}
                    onClick={() => updateFormData({ painOnset: o })}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.painOnset === o
                        ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-300 ring-offset-2'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Worsen During:</label>
               <input 
                 type="text"
                 value={formData.worsenDuring || ''}
                 onChange={(e) => updateFormData({ worsenDuring: e.target.value })}
                 className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-primary-400 outline-none text-xs font-bold text-slate-700"
               />
             </div>
             <div className="flex flex-col gap-1.5 pt-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Better During:</label>
               <input 
                 type="text"
                 value={formData.betterDuring || ''}
                 onChange={(e) => updateFormData({ betterDuring: e.target.value })}
                 className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl focus:border-primary-400 outline-none text-xs font-bold text-slate-700"
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
