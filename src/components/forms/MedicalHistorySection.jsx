import React from 'react';

export default function MedicalHistorySection({ formData, updateFormData }) {
  const checkboxFields = [
    { name: 'diabetic', label: 'DIABETIC' },
    { name: 'htn', label: 'HTN' },
    { name: 'thyroid', label: 'THYROID' },
    { name: 'cardiac', label: 'CARDIAC' },
    { name: 'breathing', label: 'BREATHING' },
    { name: 'anyOther', label: 'ANY OTHER' },
    { name: 'alc', label: 'ALC' },
    { name: 'smk', label: 'SMK' }
  ];

  const handleCheckboxChange = (name) => {
    updateFormData({ [name]: !formData[name] });
  };

  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 pt-4">
        {checkboxFields.map(field => (
          <label key={field.name} className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => handleCheckboxChange(field.name)}
              className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                formData[field.name] 
                ? 'bg-primary-600 border-primary-600 text-white' 
                : 'border-slate-300 group-hover:border-primary-400'
              }`}
            >
              {formData[field.name] && <span className="text-xs font-black">✓</span>}
            </div>
            <span className="text-[10px] font-bold text-slate-600 tracking-wider group-hover:text-primary-700 transition-colors uppercase">
              {field.label}
            </span>
          </label>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-4 bg-primary-400 rounded-full" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest italic underline decoration-primary-300 underline-offset-4">Medical History:</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chief Complaints:</label>
              <textarea 
                name="chiefComplaints"
                value={formData.chiefComplaints || ''}
                onChange={handleTextAreaChange}
                rows={3}
                className="w-full border-b-2 border-slate-100 focus:border-primary-400 outline-none transition-colors font-medium text-slate-800 py-1 resize-none bg-slate-50/30 px-2 rounded-t-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Past History:</label>
              <textarea 
                name="pastHistory"
                value={formData.pastHistory || ''}
                onChange={handleTextAreaChange}
                rows={2}
                className="w-full border-b-2 border-slate-100 focus:border-primary-400 outline-none transition-colors font-medium text-slate-800 py-1 resize-none bg-slate-50/30 px-2 rounded-t-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Falls / Accidents:</label>
              <input 
                type="text"
                name="fallsAccidents"
                value={formData.fallsAccidents || ''}
                onChange={handleTextAreaChange}
                className="w-full border-b-2 border-slate-100 focus:border-primary-400 outline-none transition-colors font-medium text-slate-800 py-1 bg-slate-50/30 px-2 rounded-t-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
