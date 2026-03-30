import React from 'react';

export default function AssessmentHeader() {
  return (
    <div className="border-b-2 border-primary-500 pb-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center p-2">
            <img 
              src="/logo.png" 
              alt="Southern Spine Logo" 
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-slate-400">LOGO</span>';
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              SOUTHERN <span className="text-primary-600">SPINE</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 mt-1 tracking-widest uppercase">
              Chiropractic | Physiotherapy | Osteopathy
            </p>
          </div>
        </div>

        <div className="text-right md:text-right">
          <h2 className="text-xl font-bold text-slate-900">Dr. RAGHUPATHI JADHAV. PT</h2>
          <p className="text-primary-600 font-bold text-xs uppercase tracking-wider">(CHIEF PHYSIOTHERAPIST)</p>
          <div className="mt-1 text-[10px] text-slate-500 font-medium space-y-0.5">
            <p>BPT.CKT.COMT.CDNT</p>
            <p>MASTER OF CHIROPRACTOR (ACKERMAN COLLEGE OF CHIROPRACTIC SWEDEN)</p>
            <p>D.O OSTEOPATHY (THE OSTEOPATHIC COLLEGE OF ONTARIO, CANADA)</p>
            <p>FDM.FASCIAL DISTORTION MODEL (GERMANY)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-primary-600 text-white rounded-lg px-4 py-2 text-[10px] font-medium flex flex-col md:flex-row justify-between gap-2">
        <p># 1-1-192/A, Street Number 6, Chikkadpally Rd, Hyderabad, Telangana - 500020.</p>
        <p>3rd Floor, Plot No. 1269, Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033.</p>
      </div>
    </div>
  );
}
