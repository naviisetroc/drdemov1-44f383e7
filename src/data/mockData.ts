export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: "M" | "F";
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment?: string;
  status: "activo" | "inactivo";
  conditions: string[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  inputType: "texto" | "voz";
  rawInput: string;
  aiOutput: string;
  format: "SOAP";
  doctorName: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  datetime: string;
  status: "programada" | "completada" | "cancelada";
  reason: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  toSpecialty: string;
  date: string;
  notes: string;
  summary: string;
}

export const patients: Patient[] = [
  { id: "1", name: "María García López", age: 45, sex: "F", phone: "+52 55 1234 5678", email: "maria@email.com", lastVisit: "2026-03-20", nextAppointment: "2026-03-25", status: "activo", conditions: ["Hipertensión", "Diabetes tipo 2"] },
  { id: "2", name: "Carlos Hernández Ruiz", age: 62, sex: "M", phone: "+52 55 9876 5432", email: "carlos@email.com", lastVisit: "2026-03-18", status: "activo", conditions: ["Artritis reumatoide"] },
  { id: "3", name: "Ana Martínez Soto", age: 33, sex: "F", phone: "+52 55 5555 1234", email: "ana@email.com", lastVisit: "2026-03-15", nextAppointment: "2026-03-28", status: "activo", conditions: ["Migraña crónica"] },
  { id: "4", name: "Roberto Sánchez Díaz", age: 28, sex: "M", phone: "+52 55 4444 3333", email: "roberto@email.com", lastVisit: "2026-02-10", status: "inactivo", conditions: [] },
  { id: "5", name: "Laura Pérez Vega", age: 55, sex: "F", phone: "+52 55 2222 8888", email: "laura@email.com", lastVisit: "2026-03-22", nextAppointment: "2026-03-24", status: "activo", conditions: ["Hipotiroidismo", "Osteoporosis"] },
  { id: "6", name: "Fernando Torres Méndez", age: 41, sex: "M", phone: "+52 55 7777 6666", email: "fernando@email.com", lastVisit: "2026-03-19", status: "activo", conditions: ["Asma"] },
];

export const clinicalNotes: ClinicalNote[] = [
  { id: "1", patientId: "1", patientName: "María García López", date: "2026-03-20", inputType: "texto", rawInput: "Paciente refiere dolor de cabeza frecuente y presión arterial elevada en casa. Toma losartán 50mg. Glucosa en ayunas 145 mg/dL.", aiOutput: "**S (Subjetivo):** Paciente femenina de 45 años refiere cefalea frecuente y cifras tensionales elevadas en domicilio. Actualmente con losartán 50mg/día.\n\n**O (Objetivo):** TA: 150/95 mmHg. FC: 78 lpm. Glucosa en ayunas: 145 mg/dL.\n\n**A (Análisis):** Hipertensión arterial no controlada. Diabetes tipo 2 con control subóptimo.\n\n**P (Plan):** Aumentar losartán a 100mg/día. Solicitar HbA1c y perfil lipídico. Cita de seguimiento en 4 semanas.", format: "SOAP", doctorName: "Dr. Alejandro Ramírez" },
  { id: "2", patientId: "3", patientName: "Ana Martínez Soto", date: "2026-03-15", inputType: "voz", rawInput: "Ana viene por migraña recurrente, tres episodios por semana, no responde bien a paracetamol. Quiere explorar tratamiento preventivo.", aiOutput: "**S (Subjetivo):** Paciente femenina de 33 años con migraña recurrente, 3 episodios/semana, sin respuesta adecuada a paracetamol. Solicita tratamiento preventivo.\n\n**O (Objetivo):** Exploración neurológica sin alteraciones. Sin signos de alarma.\n\n**A (Análisis):** Migraña sin aura, alta frecuencia. Candidata a profilaxis.\n\n**P (Plan):** Iniciar topiramato 25mg/noche con escalada progresiva. Diario de cefaleas. Reevaluación en 6 semanas.", format: "SOAP", doctorName: "Dr. Alejandro Ramírez" },
  { id: "3", patientId: "5", patientName: "Laura Pérez Vega", date: "2026-03-22", inputType: "texto", rawInput: "Revisión de rutina. Refiere cansancio y dolor articular. Última densitometría hace 1 año mostró osteopenia.", aiOutput: "**S (Subjetivo):** Paciente femenina de 55 años acude a revisión. Refiere fatiga y artralgias generalizadas. Antecedente de osteopenia.\n\n**O (Objetivo):** TSH: 6.8 mUI/L (elevada). Resto de labs pendientes.\n\n**A (Análisis):** Hipotiroidismo subclínico sintomático. Osteopenia en seguimiento.\n\n**P (Plan):** Ajustar levotiroxina. Solicitar densitometría ósea de control. Suplementar con calcio y vitamina D.", format: "SOAP", doctorName: "Dr. Alejandro Ramírez" },
];

export const appointments: Appointment[] = [
  { id: "1", patientId: "5", patientName: "Laura Pérez Vega", datetime: "2026-03-24T09:00", status: "programada", reason: "Seguimiento hipotiroidismo" },
  { id: "2", patientId: "1", patientName: "María García López", datetime: "2026-03-25T10:30", status: "programada", reason: "Control hipertensión" },
  { id: "3", patientId: "3", patientName: "Ana Martínez Soto", datetime: "2026-03-28T11:00", status: "programada", reason: "Seguimiento migraña" },
  { id: "4", patientId: "6", patientName: "Fernando Torres Méndez", datetime: "2026-03-20T14:00", status: "completada", reason: "Control de asma" },
  { id: "5", patientId: "2", patientName: "Carlos Hernández Ruiz", datetime: "2026-03-18T09:30", status: "completada", reason: "Revisión artritis" },
];

export const referrals: Referral[] = [
  { id: "1", patientId: "1", patientName: "María García López", toSpecialty: "Endocrinología", date: "2026-03-20", notes: "Diabetes tipo 2 con control subóptimo a pesar de tratamiento.", summary: "Paciente femenina de 45 años con DM2 diagnosticada hace 3 años. HbA1c última: 8.2%. Actualmente con metformina 850mg c/12h. Requiere valoración para ajuste de tratamiento." },
  { id: "2", patientId: "5", patientName: "Laura Pérez Vega", toSpecialty: "Reumatología", date: "2026-03-22", notes: "Artralgias generalizadas persistentes, descartar causa autoinmune.", summary: "Paciente femenina de 55 años con osteopenia y artralgias de 3 meses de evolución. Hipotiroidismo en tratamiento. Solicito valoración reumatológica." },
];
