import React, { useState, useRef } from 'react';
import { FiUpload, FiFileText, FiCheck, FiX, FiCamera } from 'react-icons/fi';
import { ALL_PATIENTS } from '../../data/mockData';
import { PageHeader } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function UploadReport() {
  const [form, setForm] = useState({ patient: '', title: '', category: '', notes: '' });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (f) => { if (f) setFile(f); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patient || !form.title) { toast.error('Please fill required fields'); return; }
    setSubmitted(true);
    toast.success('Report uploaded successfully!');
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Uploaded!</h2>
        <p className="text-slate-500 mb-8">The report has been added to the patient's record.</p>
        <button onClick={() => { setSubmitted(false); setFile(null); setForm({ patient:'', title:'', category:'', notes:'' }); }} className="btn-primary w-full">
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <PageHeader title="Upload Report" subtitle="Add a medical document to a patient's record" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient select */}
        <div className="card p-6 space-y-4">
          <h3 className="section-title">Report Details</h3>
          <div>
            <label className="label-lg">Patient *</label>
            <select className="input" value={form.patient} onChange={e => update('patient', e.target.value)} required>
              <option value="">Select a patient...</option>
              {ALL_PATIENTS.map(p => (
                <option key={p.id} value={p.id}>{p.name} – {p.condition}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-lg">Report Title *</label>
            <input className="input" placeholder="e.g. Lumbar Spine X-Ray" value={form.title} onChange={e => update('title', e.target.value)} required />
          </div>
          <div>
            <label className="label-lg">Category</label>
            <select className="input" value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="">Select category...</option>
              <option>Imaging</option>
              <option>Progress</option>
              <option>Treatment</option>
              <option>Lab Results</option>
              <option>Exercise Plan</option>
            </select>
          </div>
          <div>
            <label className="label-lg">Notes</label>
            <textarea className="input h-24 resize-none" placeholder="Any important notes about this report..." value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>
        </div>

        {/* File upload */}
        <div className="card p-6">
          <h3 className="section-title mb-4">Attach File</h3>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragging ? 'border-primary-400 bg-primary-50' : file ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-primary-300'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900 text-sm">{file.name}</div>
                  <div className="text-xs text-slate-500">{(file.size / 1048576).toFixed(2)} MB</div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="ml-2 p-1.5 rounded-lg text-red-400 hover:bg-red-50">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiUpload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-4">Drop a PDF or image here</p>
                <div className="flex gap-3 justify-center">
                  <button type="button" onClick={() => fileRef.current.click()} className="btn-secondary text-sm py-2 px-4">
                    <FiUpload className="w-3.5 h-3.5" /> Choose File
                  </button>
                  <button type="button" onClick={() => toast.success('Camera coming soon')} className="btn-outline text-sm py-2 px-4">
                    <FiCamera className="w-3.5 h-3.5" /> Camera
                  </button>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full text-lg py-4">
          <FiUpload className="w-5 h-5" /> Upload Report
        </button>
      </form>
    </div>
  );
}
