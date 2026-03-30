import React, { useState } from 'react';
import { FiSave, FiPrinter, FiX, FiCheckCircle, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

import AssessmentHeader from './AssessmentHeader';
import PatientInfoSection from './PatientInfoSection';
import MedicalHistorySection from './MedicalHistorySection';
import PainAssessmentSection from './PainAssessmentSection';
import ClinicalFindingsSection from './ClinicalFindingsSection';
import TreatmentSessionSection from './TreatmentSessionSection';
import ConsentSection from './ConsentSection';

export default function ClinicalForm({ patient, onClose }) {
  const [formData, setFormData] = useState({
    patientName: patient?.name || '',
    ageSex: patient ? `${patient.age} / ${patient.gender || 'M'}` : '',
    contactNo: patient?.phone || '',
    sessions: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      date: '',
      complaints: '',
      treatments: [],
      therapist: '',
      percentage: ''
    }))
  });

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 'assessment', label: 'Initial Assessment', component: AssessmentHeader, isHeader: true },
    { id: 'info', label: 'Patient Info', component: PatientInfoSection },
    { id: 'history', label: 'History', component: MedicalHistorySection },
    { id: 'pain', label: 'Pain Assessment', component: PainAssessmentSection },
    { id: 'findings', label: 'Clinical Findings', component: ClinicalFindingsSection },
    { id: 'treatment', label: 'Treatment Review', component: TreatmentSessionSection },
    { id: 'consent', label: 'Consent & Finish', component: ConsentSection },
  ];

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = () => {
    toast.success('Clinical record saved successfully!');
    if (onClose) onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const ActiveComponent = steps[activeStep].component;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-screen md:min-h-0 md:max-h-[95vh] animate-scale-in">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
               <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Clinical Record
              </h2>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                Digital Assessment Form v1.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all group"
              title="Print Form"
            >
              <FiPrinter className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group"
              title="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 overflow-x-auto">
          <div className="flex items-center gap-4 min-w-max pb-2">
            {steps.slice(1).map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeStep === idx + 1
                    ? 'bg-primary-600 text-white shadow-md'
                    : activeStep > idx + 1
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                <span className="w-5 h-5 rounded-lg bg-black/10 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Always show header in PDF/Print or as first section */}
            <AssessmentHeader />
            
            <div className="animate-fade-in-up transition-all duration-300">
               {activeStep === 0 ? (
                 <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheckCircle className="w-12 h-12 text-primary-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Ready to start the assessment?</h3>
                    <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                      Follow the multi-step guide to complete the patient's clinical record.
                    </p>
                    <button 
                      onClick={nextStep}
                      className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 mx-auto shadow-xl hover:scale-105 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                    >
                      Start Assessment <FiChevronRight className="w-5 h-5" />
                    </button>
                 </div>
               ) : (
                 <ActiveComponent formData={formData} updateFormData={updateFormData} patient={patient} />
               )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky bottom-0 z-10">
          <div className="flex gap-2">
            {activeStep > 0 && (
              <button 
                onClick={prevStep}
                className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2 group text-xs font-black uppercase tracking-widest"
              >
                <FiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Previous
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            {activeStep < steps.length - 1 ? (
              <button 
                onClick={nextStep}
                className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 group text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200"
              >
                Next Step <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl flex items-center gap-2 font-black uppercase tracking-widest text-xs shadow-lg shadow-green-100 transition-all hover:scale-105"
              >
                <FiSave className="w-4 h-4" /> Finalize Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
