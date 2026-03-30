import React from 'react';

export default function ConsentSection({ formData, updateFormData }) {
  const treatmentPrograms = [
    'Only PHY', 'Adv Physio', 'Only Manips', 'Only Rehab', '3D Rx', 'Osteo'
  ];

  const handleProgramToggle = (program) => {
    const currentPrograms = formData.treatmentPrograms || [];
    const updatedPrograms = currentPrograms.includes(program)
      ? currentPrograms.filter(p => p !== program)
      : [...currentPrograms, program];
    updateFormData({ treatmentPrograms: updatedPrograms });
  };

  return (
    <div className="space-y-10 py-6">
      {/* Notes Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" /> NOTES:
        </h3>
        <textarea 
          value={formData.notes || ''}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          rows={5}
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 focus:border-primary-400 outline-none resize-none shadow-inner"
          placeholder="Enter additional clinical notes here..."
        />
      </div>

      {/* Treatment Programme */}
      <div className="bg-primary-50/30 border-2 border-primary-100 rounded-3xl p-8">
        <h3 className="text-sm font-black text-primary-700 uppercase tracking-widest text-center mb-8 underline underline-offset-8 decoration-primary-300">
          TREATMENT PROGRAMME
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {treatmentPrograms.map(prog => (
            <label key={prog} className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => handleProgramToggle(prog)}
                className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                  (formData.treatmentPrograms || []).includes(prog)
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-slate-300 group-hover:border-primary-400'
                }`}
              >
                {(formData.treatmentPrograms || []).includes(prog) && <span className="text-[10px] font-black">✓</span>}
              </div>
              <span className="text-[11px] font-black text-slate-600 group-hover:text-primary-700 transition-colors uppercase tracking-wider">
                {prog}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Informed Consent */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-center italic decoration-primary-300 underline underline-offset-4">
          INFORMED CONSENT:
        </h3>
        <div className="text-[10px] leading-relaxed text-slate-500 space-y-4 font-medium text-justify border-l-4 border-slate-100 pl-6 italic">
          <p>I understand that Physiotherapy treatments may include an individualized exercise prescription and various forms of manual therapy techniques such as mobilization, manipulation, soft tissue release, and stretches. Treatments may also include modalities such as heat, ice, therapeutic taping, ultrasound, laser, TENS, interferential current, shock wave, and electric muscular stimulation. Other treatment options include acupuncture/dry needling, which involves the insertion of single-use, sterile, disposable needles through the skin, and into the underlying, muscles.</p>
          <p>I understand that the primary goals of Physiotherapy treatments are to help reduce my pain and improve my mobility, strength, endurance, function, and quality of life.</p>
          <p>I understand that there are very small possibilities of risks like Joint and/or muscle soreness, skin irritations, burns, bleeding, bruising, and new or re-injury. I do not expect the Physiotherapist to anticipate all the possible risks and complications. I wish to rely on the Physiotherapist to exercise proper judgment during the course of treatment to make decisions based on my best interest.</p>
          <p>I have read all the information provided here or it has been read to me. I understand the contents of this informative consent form. I understand the risks involved in physical therapy and agree to participate in the procedures to be conducted and comply with the established plan of care set forth by my physical therapist. I have had the opportunity to ask questions and all of which were answered to me accordingly.</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
           <label className="flex items-start gap-3 cursor-pointer group bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div 
               onClick={() => updateFormData({ consentLegalAge: !formData.consentLegalAge })}
               className={`w-5 h-5 mt-0.5 rounded-md border-2 transition-all flex flex-shrink-0 items-center justify-center ${
                 formData.consentLegalAge
                   ? 'bg-primary-600 border-primary-600 text-white'
                   : 'bg-white border-slate-300 group-hover:border-primary-400'
               }`}
             >
               {formData.consentLegalAge && <span className="text-[10px] font-black">✓</span>}
             </div>
             <span className="text-[10px] font-bold text-slate-600 leading-tight">
               I am of legal age and I give my full consent to the physical therapy treatment.
             </span>
           </label>
           <label className="flex items-start gap-3 cursor-pointer group bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div 
               onClick={() => updateFormData({ consentGuardian: !formData.consentGuardian })}
               className={`w-5 h-5 mt-0.5 rounded-md border-2 transition-all flex flex-shrink-0 items-center justify-center ${
                 formData.consentGuardian
                   ? 'bg-primary-600 border-primary-600 text-white'
                   : 'bg-white border-slate-300 group-hover:border-primary-400'
               }`}
             >
               {formData.consentGuardian && <span className="text-[10px] font-black">✓</span>}
             </div>
             <span className="text-[10px] font-bold text-slate-600 leading-tight">
               I am below legal age and my parent or legal guardian gives his/her full consent to the physical therapy treatment, which I will undergo.
             </span>
           </label>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4 pt-4 border-t-2 border-slate-100">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">TERMS AND CONDITIONS:</h3>
        <ul className="text-[10px] font-bold text-slate-500 space-y-2 list-disc pl-5">
           <li>Treatment Fee, to be paid in full advance.</li>
           <li>Payment for treatment Sessions is valid or extended up to a maximum of 15 days on the package given/taken.</li>
           <li>Extension of treatment sessions will be solely at the discretion of the physiotherapist.</li>
           <li>Refunds are not applicable for the package fee.</li>
        </ul>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
        <div className="flex flex-col gap-2">
          <div className="border-b-2 border-slate-200 h-12 flex items-end px-2 font-handwriting text-primary-600 text-lg">
             {formData.place || 'Hyderabad'}
          </div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Place</label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="border-b-2 border-slate-200 h-12 flex items-end justify-center px-2 font-bold text-slate-800 text-sm italic">
             {new Date().toLocaleDateString()}
          </div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="border-b-2 border-slate-200 h-12 flex items-center justify-center p-2 bg-slate-50/50 rounded-t-lg">
             <div className="w-full h-full border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
               Digital signature placeholder
             </div>
          </div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Patient Sign</label>
        </div>
      </div>
    </div>
  );
}
