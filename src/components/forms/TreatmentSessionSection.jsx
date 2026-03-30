import React from 'react';

export default function TreatmentSessionSection({ formData, updateFormData }) {
  const sessions = formData.sessions || Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    date: '',
    complaints: '',
    treatments: [],
    therapist: '',
    percentage: ''
  }));

  const treatmentOptions = [
    'ROM Excs', 'Strengthening', 'Stretching', 'Mobilization', 'Balance', 'UST', 'TENS', 'IFT', 'IRR', 'MST', 'COMBI DN', 'EDN', 'CUP', 'MH', 'LT', 'IASTM', 'SWT', 'MWD', 'BTL', 'L.TRX', 'C.TRX', 'DAD', 'DCT'
  ];

  const handleSessionUpdate = (index, field, value) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = { ...updatedSessions[index], [field]: value };
    updateFormData({ sessions: updatedSessions });
  };

  const handleTreatmentToggle = (index, treatment) => {
    const updatedSessions = [...sessions];
    const currentTreatments = updatedSessions[index].treatments || [];
    updatedSessions[index].treatments = currentTreatments.includes(treatment)
      ? currentTreatments.filter(t => t !== treatment)
      : [...currentTreatments, treatment];
    updateFormData({ sessions: updatedSessions });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic decoration-primary-300 underline-offset-4 decoration-2 underline">
            P-D-P Review Program:
          </h3>
        </div>
        <div className="bg-primary-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transform -skew-x-12">
          Session Tracking
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {sessions.map((session, index) => (
          <div key={session.id} className="border-2 border-slate-100 rounded-3xl p-6 bg-white hover:border-primary-200 transition-all shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b pb-4 border-slate-50">
              <span className="text-xs font-black text-primary-600 uppercase tracking-widest px-3 py-1 bg-primary-50 rounded-lg">
                Session: {session.id}
              </span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date:</label>
                <input 
                  type="date"
                  value={session.date}
                  onChange={(e) => handleSessionUpdate(index, 'date', e.target.value)}
                  className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-700 p-2 outline-none focus:ring-2 ring-primary-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Any Complaints:</label>
              <textarea 
                value={session.complaints}
                onChange={(e) => handleSessionUpdate(index, 'complaints', e.target.value)}
                rows={2}
                className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-xl p-3 text-xs font-bold text-slate-700 focus:border-primary-200 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary-600">Rx Done:</span>
                <span className="text-[9px] text-slate-400 font-bold italic">(Select all applied)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {treatmentOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleTreatmentToggle(index, opt)}
                    className={`px-2 py-1 rounded text-[8px] font-black tracking-tighter uppercase transition-all ${
                      session.treatments.includes(opt)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Therapist:</label>
                <input 
                  type="text"
                  value={session.therapist}
                  onChange={(e) => handleSessionUpdate(index, 'therapist', e.target.value)}
                  className="bg-slate-50 border-b-2 border-slate-200 p-2 rounded text-xs font-bold text-slate-700 outline-none focus:border-primary-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">% Completed:</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={session.percentage}
                    onChange={(e) => handleSessionUpdate(index, 'percentage', e.target.value)}
                    className="flex-1 bg-slate-50 border-b-2 border-slate-200 p-2 rounded text-xs font-bold text-slate-700 outline-none focus:border-primary-400 text-center"
                    placeholder="75%"
                  />
                  <span className="text-slate-400 font-black text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
