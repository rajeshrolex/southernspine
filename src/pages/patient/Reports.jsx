import React, { useState, useRef } from 'react';
import { FiFileText, FiUpload, FiDownload, FiTrash2, FiCamera, FiSearch, FiEye } from 'react-icons/fi';
import { PATIENT_REPORTS } from '../../data/mockData';
import { PageHeader, StatusBadge } from '../../components/ui/index';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  Imaging:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   badge: 'blue' },
  Progress:  { bg: 'bg-green-50',  icon: 'text-green-500',  badge: 'green' },
  Treatment: { bg: 'bg-purple-50', icon: 'text-purple-500', badge: 'purple' },
};

export default function Reports() {
  const [reports, setReports] = useState(PATIENT_REPORTS);
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const newReport = {
      id: `RPT${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: 'PDF',
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'You',
      size: `${(file.size / 1048576).toFixed(1)} MB`,
      category: 'Progress',
    };
    setReports(r => [newReport, ...r]);
    toast.success('Report uploaded successfully!');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDelete = (id) => {
    setReports(r => r.filter(report => report.id !== id));
    toast.error('Report deleted');
  };

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader title="Medical Reports" subtitle="Your health documents and test results" />

      {/* Upload area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`card border-2 border-dashed p-10 text-center transition-all duration-200 ${
          dragging ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-blue-50/30'
        }`}
      >
        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiUpload className="w-7 h-7 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Upload a Report</h3>
        <p className="text-slate-500 text-sm mb-6">Drop a PDF or image here, or choose a file</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => fileRef.current.click()}
            className="btn-primary"
          >
            <FiUpload className="w-4 h-4" /> Choose File
          </button>
          <button
            onClick={() => { toast.success('Camera capture coming soon!'); }}
            className="btn-secondary"
          >
            <FiCamera className="w-4 h-4" /> Camera
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input className="input pl-12 text-sm" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Reports grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No reports found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(report => {
            const colors = CATEGORY_COLORS[report.category] || CATEGORY_COLORS.Progress;
            return (
              <div key={report.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <FiFileText className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <span className={`badge ${colors.badge === 'blue' ? 'badge-blue' : colors.badge === 'green' ? 'badge-green' : 'badge-purple'}`}>
                    {report.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{report.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{report.type} · {report.size}</p>
                </div>
                <div className="text-xs text-slate-400">
                  By {report.uploadedBy} · {new Date(report.date).toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => toast.success('Downloading...')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-50 text-primary-700 text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    <FiDownload className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={() => toast.success('Opening preview...')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <FiEye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
