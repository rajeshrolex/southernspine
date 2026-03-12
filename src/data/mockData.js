// Mock Data for Southern Spine Clinic Management System

export const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    specialty: 'Physiotherapy',
    avatar: null,
    initials: 'SM',
    color: 'bg-blue-500',
    rating: 4.9,
    experience: '12 years',
    available: true,
    bio: 'Specializes in sports rehabilitation and chronic pain management.',
  },
  {
    id: 2,
    name: 'Dr. James Lawson',
    specialty: 'Chiropractic',
    avatar: null,
    initials: 'JL',
    color: 'bg-teal-500',
    rating: 4.8,
    experience: '9 years',
    available: true,
    bio: 'Expert in spinal adjustments and posture correction.',
  },
  {
    id: 3,
    name: 'Dr. Anna Chen',
    specialty: 'Physiotherapy',
    avatar: null,
    initials: 'AC',
    color: 'bg-purple-500',
    rating: 4.7,
    experience: '7 years',
    available: true,
    bio: 'Focused on neurological rehabilitation and balance disorders.',
  },
  {
    id: 4,
    name: 'Dr. Michael Torres',
    specialty: 'Chiropractic',
    avatar: null,
    initials: 'MT',
    color: 'bg-orange-500',
    rating: 4.9,
    experience: '15 years',
    available: false,
    bio: 'Specializes in sports chiropractic and injury prevention.',
  },
];

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

export const BOOKED_SLOTS = ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'];

export const APPOINTMENT_TYPES = [
  { id: 1, label: 'Initial Consultation', duration: '60 min', price: 120 },
  { id: 2, label: 'Follow-up Session',    duration: '45 min', price: 90  },
  { id: 3, label: 'Physiotherapy',        duration: '60 min', price: 110 },
  { id: 4, label: 'Chiropractic Adjustment', duration: '30 min', price: 80 },
  { id: 5, label: 'Massage Therapy',      duration: '60 min', price: 100 },
  { id: 6, label: 'Exercise Rehabilitation', duration: '45 min', price: 95 },
];

export const PATIENT_APPOINTMENTS = [
  {
    id: 'APT001',
    doctor: 'Dr. Sarah Mitchell',
    specialty: 'Physiotherapy',
    date: '2026-03-15',
    time: '10:30 AM',
    type: 'Follow-up Session',
    status: 'upcoming',
    location: 'Room 3A',
    notes: 'Bring previous X-ray reports',
  },
  {
    id: 'APT002',
    doctor: 'Dr. James Lawson',
    specialty: 'Chiropractic',
    date: '2026-03-08',
    time: '02:00 PM',
    type: 'Chiropractic Adjustment',
    status: 'completed',
    location: 'Room 1B',
    notes: '',
  },
  {
    id: 'APT003',
    doctor: 'Dr. Anna Chen',
    specialty: 'Physiotherapy',
    date: '2026-02-28',
    time: '11:00 AM',
    type: 'Initial Consultation',
    status: 'completed',
    location: 'Room 2A',
    notes: '',
  },
  {
    id: 'APT004',
    doctor: 'Dr. Sarah Mitchell',
    specialty: 'Physiotherapy',
    date: '2026-03-22',
    time: '09:30 AM',
    type: 'Physiotherapy',
    status: 'upcoming',
    location: 'Room 3A',
    notes: '',
  },
];

export const PATIENT_REPORTS = [
  {
    id: 'RPT001',
    title: 'Lumbar Spine X-Ray',
    type: 'PDF',
    date: '2026-02-28',
    uploadedBy: 'Dr. Anna Chen',
    size: '2.4 MB',
    category: 'Imaging',
  },
  {
    id: 'RPT002',
    title: 'Treatment Progress Report',
    type: 'PDF',
    date: '2026-03-08',
    uploadedBy: 'Dr. James Lawson',
    size: '1.1 MB',
    category: 'Progress',
  },
  {
    id: 'RPT003',
    title: 'Exercise Plan - Phase 1',
    type: 'PDF',
    date: '2026-03-08',
    uploadedBy: 'Dr. James Lawson',
    size: '0.8 MB',
    category: 'Treatment',
  },
];

export const DOCTOR_TODAY_APPOINTMENTS = [
  { id: 'APT010', patient: 'Mary Johnson', time: '09:00 AM', type: 'Initial Consultation', status: 'completed', age: 54 },
  { id: 'APT011', patient: 'Robert Davis',  time: '09:30 AM', type: 'Follow-up Session',    status: 'completed', age: 67 },
  { id: 'APT012', patient: 'Linda Wilson',  time: '10:30 AM', type: 'Physiotherapy',        status: 'in-progress', age: 42 },
  { id: 'APT013', patient: 'John Smith',    time: '11:00 AM', type: 'Follow-up Session',    status: 'upcoming', age: 38 },
  { id: 'APT014', patient: 'Patricia Moore', time: '02:00 PM', type: 'Physiotherapy',       status: 'upcoming', age: 61 },
  { id: 'APT015', patient: 'James Garcia',  time: '02:30 PM', type: 'Initial Consultation', status: 'upcoming', age: 29 },
  { id: 'APT016', patient: 'Barbara Lee',   time: '03:30 PM', type: 'Follow-up Session',    status: 'upcoming', age: 72 },
];

export const ALL_PATIENTS = [
  { id: 'P001', name: 'Mary Johnson',    age: 54, phone: '+1 (555) 234-5678', email: 'mary@example.com', lastVisit: '2026-03-10', condition: 'Lower Back Pain', doctor: 'Dr. Sarah Mitchell', status: 'active' },
  { id: 'P002', name: 'Robert Davis',    age: 67, phone: '+1 (555) 345-6789', email: 'robert@example.com', lastVisit: '2026-03-09', condition: 'Neck Pain',       doctor: 'Dr. James Lawson',   status: 'active' },
  { id: 'P003', name: 'Linda Wilson',    age: 42, phone: '+1 (555) 456-7890', email: 'linda@example.com',  lastVisit: '2026-03-11', condition: 'Shoulder Injury', doctor: 'Dr. Sarah Mitchell', status: 'active' },
  { id: 'P004', name: 'John Smith',      age: 38, phone: '+1 (555) 567-8901', email: 'john@example.com',   lastVisit: '2026-02-25', condition: 'Sciatica',        doctor: 'Dr. Anna Chen',      status: 'active' },
  { id: 'P005', name: 'Patricia Moore',  age: 61, phone: '+1 (555) 678-9012', email: 'patricia@example.com', lastVisit: '2026-03-08', condition: 'Knee Rehab',   doctor: 'Dr. Sarah Mitchell', status: 'active' },
  { id: 'P006', name: 'James Garcia',    age: 29, phone: '+1 (555) 789-0123', email: 'james@example.com',  lastVisit: '2026-03-01', condition: 'Sports Injury',   doctor: 'Dr. Anna Chen',      status: 'active' },
  { id: 'P007', name: 'Barbara Lee',     age: 72, phone: '+1 (555) 890-1234', email: 'barbara@example.com', lastVisit: '2026-02-20', condition: 'Arthritis',     doctor: 'Dr. James Lawson',   status: 'inactive' },
  { id: 'P008', name: 'Michael Taylor',  age: 45, phone: '+1 (555) 901-2345', email: 'michael@example.com', lastVisit: '2026-03-05', condition: 'Disc Herniation', doctor: 'Dr. James Lawson', status: 'active' },
];

export const ADMIN_STATS = {
  totalPatients:      248,
  totalDoctors:       12,
  totalClinics:       3,
  monthlyRevenue:     42800,
  appointmentsToday:  34,
  appointmentsMonth:  412,
  pendingReports:     8,
  patientGrowth:      '+12%',
  revenueGrowth:      '+8.4%',
};

export const REVENUE_DATA = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [32400, 35600, 31200, 38900, 40100, 39500, 42800],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.08)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#2563eb',
      pointRadius: 4,
    },
  ],
};

export const APPOINTMENTS_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Appointments',
      data: [12, 19, 15, 22, 18, 8],
      backgroundColor: 'rgba(37,99,235,0.15)',
      borderColor: '#2563eb',
      borderWidth: 2,
      borderRadius: 8,
    },
  ],
};

export const CLINICS = [
  { id: 1, name: 'Southern Spine – Main',   address: '123 Health Ave, Melbourne VIC 3000', doctors: 5, patients: 142, phone: '+61 3 9000 1111', status: 'active' },
  { id: 2, name: 'Southern Spine – North',  address: '45 Wellness Rd, Essendon VIC 3040',  doctors: 4, patients: 68,  phone: '+61 3 9000 2222', status: 'active' },
  { id: 3, name: 'Southern Spine – South',  address: '88 Spine St, Dandenong VIC 3175',    doctors: 3, patients: 38,  phone: '+61 3 9000 3333', status: 'active' },
];

export const MOCK_USER = {
  id: 'U001',
  name: 'Anna Sample',
  email: 'anna@example.com',
  phone: '+61 400 000 001',
  dob: '1988-06-15',
  gender: 'Female',
  address: '12 Oak Street, Richmond VIC 3121',
  emergencyContact: 'James Sample (+61 400 000 002)',
  role: 'patient',
};
