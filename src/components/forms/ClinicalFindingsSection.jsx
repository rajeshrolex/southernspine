import React from 'react';

export default function ClinicalFindingsSection({ formData, updateFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const fields = [
    { name: 'onObservation', label: 'On Observation:' },
    { name: 'onPalpation', label: 'On Palpation:' },
    { name: 'onExamination', label: 'On Examination:' },
    { name: 'specialTests', label: 'Special Tests:' },
    { name: 'diagnosis', label: 'Diagnosis:' },
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Clinical Findings:</h3>
      </div>

      <div className="space-y-8 bg-slate-50/30 p-8 rounded-3xl border-2 border-slate-100">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black text-primary-700 uppercase tracking-widest mb-1 underline decoration-primary-200 underline-offset-4">INVESTIGATIONS:</label>
          <textarea 
            name="investigations"
            value={formData.investigations || ''}
            onChange={handleChange}
            rows={3}
            placeholder="X-ray, MRI, Blood tests, etc."
            className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl focus:border-primary-400 outline-none text-xs font-bold text-slate-700 resize-none transition-all shadow-sm"
          />
        </div>

        <div className="grid gap-6">
          {fields.map(field => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> {field.label}
              </label>
              <input 
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full bg-white border-b-2 border-slate-100 p-2 focus:border-primary-400 outline-none text-xs font-bold text-slate-800 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
