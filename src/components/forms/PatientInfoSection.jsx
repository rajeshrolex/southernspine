import React from 'react';

export default function PatientInfoSection({ formData, updateFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Patient Information:</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Patient Name:</label>
          <input 
            type="text" 
            name="patientName"
            value={formData.patientName || ''}
            onChange={handleChange}
            className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Age / Sex:</label>
            <input 
              type="text" 
              name="ageSex"
              value={formData.ageSex || ''}
              onChange={handleChange}
              placeholder="e.g. 35/M"
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Contact No:</label>
            <input 
              type="text" 
              name="contactNo"
              value={formData.contactNo || ''}
              onChange={handleChange}
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Locality:</label>
            <input 
              type="text" 
              name="locality"
              value={formData.locality || ''}
              onChange={handleChange}
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Occupation:</label>
            <input 
              type="text" 
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleChange}
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Source / Referred By:</label>
            <input 
              type="text" 
              name="source"
              value={formData.source || ''}
              onChange={handleChange}
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Weight (kg):</label>
            <input 
              type="text" 
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              className="border-b-2 border-slate-200 focus:border-primary-500 outline-none py-1 transition-colors font-medium text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
