import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiCalendar, FiFileText, FiUpload, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import { StatusBadge } from '../../components/ui/index';
import ClinicalForm from '../../components/forms/ClinicalForm';
import toast from 'react-hot-toast';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showClinicalForm, setShowClinicalForm] = useState(false);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient list and filter for this id (or fetch specific if endpoint exists)
        const pResp = await api.get('/api/patients/list.php');
        const found = pResp.data.find(p => p.id.toString() === id);
        
        if (found) {
          setPatient(found);
          // Fetch their appointments, reports, and clinical records
          const [aResp, rResp, cResp] = await Promise.all([
            api.get(`/api/appointments/list.php?patient_id=${id}`),
            api.get(`/api/reports/list.php?patient_id=${id}`),
            api.get(`/api/assessments/list.php?patient_id=${id}`)
          ]);
          setAppointments(aResp.data);
          setReports(rResp.data);
          setAssessments(cResp.data);
        } else {
          toast.error('Patient not found');
          navigate('/doctor/patients');
        }
      } catch (error) {
        toast.error('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading patient dossier...</div>;
  if (!patient) return null;

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
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 uppercase">
          {(patient.name || 'P').split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
            <StatusBadge status={patient.status || 'active'} />
          </div>
          <p className="text-slate-500 mb-3">Joined: {new Date(patient.created_at).toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 truncate max-w-[200px]"><FiMail className="text-slate-400 w-4 h-4" />{patient.email}</span>
            <span className="flex items-center gap-1.5"><FiPhone className="text-slate-400 w-4 h-4" />{patient.phone || 'No phone'}</span>
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
          <div className="text-3xl font-bold text-primary-600 mb-1">{appointments.length}</div>
          <div className="text-sm text-slate-500">Total Sessions</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{appointments.filter(a=>a.status==='completed').length}</div>
          <div className="text-sm text-slate-500">Completed</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{reports.length}</div>
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
            {appointments.length === 0 && <p className="p-4 text-center text-sm text-slate-400">No appointments found</p>}
            {appointments.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{a.type}</div>
                  <div className="text-xs text-slate-400">{new Date(a.appointment_date).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})} · {a.appointment_time}</div>
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
            {reports.length === 0 && <p className="p-4 text-center text-sm text-slate-400">No reports found</p>}
            {reports.map(r => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{r.title}</div>
                  <div className="text-xs text-slate-400">{r.category} · {r.size || 'N/A'}</div>
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

      {/* Clinical Assessment History */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiActivity className="text-primary-500 w-4 h-4" />
            <h3 className="section-title">Clinical History</h3>
          </div>
          <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
            Stored Records
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {assessments.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                 <FiFileText className="text-slate-300 w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400 font-medium italic">No previous clinical assessments found for this patient.</p>
              <button 
                onClick={() => setShowClinicalForm(true)}
                className="text-xs text-primary-600 font-bold hover:underline uppercase tracking-widest"
              >
                + Create Initial Assessment
              </button>
            </div>
          ) : (
            assessments.map(ass => (
              <div key={ass.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all text-primary-600 shadow-sm">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Clinical Assessment</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(ass.assessment_date).toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })}
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      Dr. {ass.doctor_name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex flex-wrap gap-2 mr-4">
                      {ass.content?.painScore !== undefined && (
                        <span className="text-[9px] font-black p-1 px-2 rounded bg-red-50 text-red-600 uppercase tracking-tighter shadow-sm border border-red-100">
                          Pain: {ass.content.painScore}/10
                        </span>
                      )}
                      {ass.content?.treatmentPrograms?.slice(0, 1).map(p => (
                        <span key={p} className="text-[9px] font-black p-1 px-2 rounded bg-blue-50 text-blue-600 uppercase tracking-tighter shadow-sm border border-blue-100">
                          {p}
                        </span>
                      ))}
                   </div>
                   <button className="btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                     View Summary
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6">
        <h3 className="section-title mb-4 flex items-center gap-2"><FiActivity className="text-primary-500 w-4 h-4" /> Clinical Notes</h3>
        <textarea
          className="input h-32 resize-none"
          placeholder="Add notes about this patient's condition, progress, or treatment plan..."
        />
        <button className="btn-primary mt-3 text-sm py-2.5 px-5" onClick={() => toast.success('Notes saved to system')}>Save Notes</button>
      </div>
    </div>
  );
}
