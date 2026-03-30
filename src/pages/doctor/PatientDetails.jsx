import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiCalendar, FiFileText, FiUpload, FiActivity } from 'react-icons/fi';
import { ALL_PATIENTS, PATIENT_APPOINTMENTS, PATIENT_REPORTS } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/index';
import ClinicalForm from '../../components/forms/ClinicalForm';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showClinicalForm, setShowClinicalForm] = React.useState(false);
  const patient = ALL_PATIENTS.find(p => p.id === id) || ALL_PATIENTS[0];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl relative">
      {showClinicalForm && (
        <ClinicalForm 
          patient={patient} 
          onClose={() => setShowClinicalForm(false)} 
        />
      )}
      {/* Back */}
      <button onClick={() => navigate('/doctor/patients')} className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors">
        <FiArrowLeft className="w-5 h-5" /> Back to Patients
      </button>

      {/* Header card */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
            <StatusBadge status={patient.status} />
          </div>
          <p className="text-slate-500 mb-3">{patient.age} years · {patient.condition}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><FiPhone className="text-slate-400 w-4 h-4" />{patient.phone}</span>
            <span className="flex items-center gap-1.5"><FiMail className="text-slate-400 w-4 h-4" />{patient.email}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowClinicalForm(true)} className="btn-primary text-sm py-2 px-4 shadow-lg shadow-primary-100 flex items-center justify-center gap-2">
            <FiFileText className="w-4 h-4" /> Add Clinical Record
          </button>
          <button onClick={() => navigate('/doctor/upload-report')} className="btn-secondary text-sm py-2 px-4 border border-slate-200">
            <FiUpload className="w-4 h-4" /> Upload Report
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-1">{PATIENT_APPOINTMENTS.length}</div>
          <div className="text-sm text-slate-500">Total Sessions</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{PATIENT_APPOINTMENTS.filter(a=>a.status==='completed').length}</div>
          <div className="text-sm text-slate-500">Completed</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{PATIENT_REPORTS.length}</div>
          <div className="text-sm text-slate-500">Reports</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Appointment history */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <FiCalendar className="text-primary-500 w-4 h-4" />
            <h3 className="section-title">Appointment History</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {PATIENT_APPOINTMENTS.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{a.type}</div>
                  <div className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})} · {a.time}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <FiFileText className="text-primary-500 w-4 h-4" />
            <h3 className="section-title">Medical Reports</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {PATIENT_REPORTS.map(r => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{r.title}</div>
                  <div className="text-xs text-slate-400">{r.category} · {r.size}</div>
                </div>
                <button className="text-xs text-primary-600 font-semibold hover:underline">View</button>
              </div>
            ))}
          </div>
          <div className="p-5 border-t border-slate-100">
            <button onClick={() => navigate('/doctor/upload-report')} className="btn-secondary w-full text-sm py-2.5">
              <FiUpload className="w-4 h-4" /> Upload New Report
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6">
        <h3 className="section-title mb-4 flex items-center gap-2"><FiActivity className="text-primary-500 w-4 h-4" /> Clinical Notes</h3>
        <textarea
          className="input h-32 resize-none"
          placeholder="Add notes about this patient's condition, progress, or treatment plan..."
        />
        <button className="btn-primary mt-3 text-sm py-2.5 px-5">Save Notes</button>
      </div>
    </div>
  );
}
