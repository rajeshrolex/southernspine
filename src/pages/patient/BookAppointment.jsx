import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiArrowRight, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import { DOCTORS, TIME_SLOTS, BOOKED_SLOTS, APPOINTMENT_TYPES } from '../../data/mockData';
import toast from 'react-hot-toast';

const STEPS = ['Doctor', 'Date & Type', 'Time Slot', 'Confirm'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done   = step < current;
        const active = step === current;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={done ? 'step-done' : active ? 'step-active' : 'step-inactive'}>
                {done ? '✓' : step}
              </div>
              <span className={`text-xs mt-1 font-medium hidden sm:block text-center leading-tight max-w-[56px] ${active ? 'text-primary-600' : done ? 'text-green-600' : 'text-slate-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1.5 sm:mx-2 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ doctor: null, date: '', type: null, time: '' });
  const [booked, setBooked] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleConfirm = () => { setBooked(true); toast.success('Appointment booked!'); };

  if (booked) {
    return (
      <div className="max-w-md mx-auto text-center py-10 animate-fade-in-up px-2">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-slate-500 mb-6 text-sm">Your appointment has been successfully booked.</p>
        <div className="card p-5 text-left mb-6 space-y-3">
          {[
            ['Doctor', selected.doctor?.name],
            ['Date', new Date(selected.date).toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long' })],
            ['Time', selected.time],
            ['Type', selected.type?.label],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-sm border-b border-slate-50 pb-2">
              <span className="text-slate-500">{l}</span>
              <span className="font-semibold text-slate-900 text-right ml-4">{v}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-1">
            <span className="font-bold text-slate-900">Total Paid</span>
            <span className="font-bold text-green-700 text-lg">${selected.type?.price}</span>
          </div>
        </div>
        <button onClick={() => navigate('/patient/appointments')} className="btn-primary w-full mb-3">
          View Appointments <FiArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => { setBooked(false); setStep(1); setSelected({ doctor:null, date:'', type:null, time:'' }); }} className="btn-outline w-full">
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <StepIndicator current={step} />

      {/* Step 1 – Select Doctor */}
      {step === 1 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">Choose your specialist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOCTORS.filter(d => d.available).map(doc => (
              <div
                key={doc.id}
                onClick={() => { setSelected(s => ({...s, doctor: doc})); setStep(2); }}
                className={`card-hover p-5 ${selected.doctor?.id === doc.id ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 ${doc.color} rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}>
                    {doc.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-base leading-tight truncate">{doc.name}</h4>
                    <p className="text-sm text-primary-600 font-semibold">{doc.specialty}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{doc.bio}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">⭐ {doc.rating} · {doc.experience}</span>
                  <span className="text-primary-600 font-semibold flex items-center gap-1">
                    Select <FiArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 – Date & Type */}
      {step === 2 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Select date & type</h3>
          <p className="text-slate-500 mb-5 text-sm">With {selected.doctor?.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-5">
              <label className="label-lg flex items-center gap-2 mb-3"><FiCalendar className="text-primary-500" /> Date</label>
              <input type="date" min={today} value={selected.date} onChange={e => setSelected(s=>({...s,date:e.target.value}))} className="input text-base py-3.5 w-full" />
            </div>
            <div className="card p-5">
              <label className="label-lg mb-3 block">Appointment Type</label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {APPOINTMENT_TYPES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelected(s=>({...s,type:t}))}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selected.type?.id === t.id ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{t.label}</div>
                      <div className="text-xs text-slate-500">{t.duration}</div>
                    </div>
                    <div className="font-bold text-primary-700 ml-4">${t.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(1)} className="btn-outline px-5 py-3">
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button disabled={!selected.date || !selected.type} onClick={() => setStep(3)} className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 – Time Slot */}
      {step === 3 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">Choose a time</h3>
          <p className="text-slate-500 mb-5 text-sm">
            {new Date(selected.date).toLocaleDateString('en-AU', { weekday:'long', day:'numeric', month:'long' })}
          </p>
          <div className="card p-5">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {TIME_SLOTS.map(slot => {
                const taken = BOOKED_SLOTS.includes(slot);
                const sel   = selected.time === slot;
                return (
                  <button
                    key={slot}
                    disabled={taken}
                    onClick={() => setSelected(s=>({...s,time:slot}))}
                    className={`py-3 px-1 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      taken ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : sel  ? 'bg-primary-600 text-white border-primary-600 shadow-soft'
                                   : 'bg-white text-slate-700 border-slate-200 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >{slot}</button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary-600 rounded inline-block" /> Selected</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-200 rounded inline-block" /> Unavailable</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-white border-2 border-slate-300 rounded inline-block" /> Available</span>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(2)} className="btn-outline px-5 py-3">
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button disabled={!selected.time} onClick={() => setStep(4)} className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4 – Confirm & Pay */}
      {step === 4 && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">Review & Confirm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Summary */}
            <div className="card p-5 space-y-3">
              <h4 className="font-bold text-slate-800 mb-1">Appointment Summary</h4>
              {[
                ['Doctor',   selected.doctor?.name],
                ['Specialty',selected.doctor?.specialty],
                ['Date',     new Date(selected.date).toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'long'})],
                ['Time',     selected.time],
                ['Type',     selected.type?.label],
                ['Duration', selected.type?.duration],
              ].map(([l,v]) => (
                <div key={l} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{l}</span>
                  <span className="font-semibold text-slate-900 text-right ml-4">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-base pt-1">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-700 text-xl">${selected.type?.price}</span>
              </div>
            </div>
            {/* Payment */}
            <div className="card p-5 space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2"><FiCreditCard className="text-primary-500" /> Payment</h4>
              <div>
                <label className="label">Card Number</label>
                <input className="input" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Expiry</label><input className="input" placeholder="MM/YY" /></div>
                <div><label className="label">CVV</label><input className="input" placeholder="123" /></div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700 border border-green-100">🔒 Your payment is secure and encrypted.</div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(3)} className="btn-outline px-5 py-3">
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={handleConfirm} className="btn-primary flex-1 py-3 text-base">
              <FiCheckCircle className="w-5 h-5" /> Pay ${selected.type?.price}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
