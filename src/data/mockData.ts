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
  bloodType?: string;
  allergies?: string[];
  insuranceProvider?: string;
  emergencyContact?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  inputType: "texto" | "voz";
  rawInput: string;
  aiOutput: string;
  format: "SOAP" | "Estructurado";
  doctorName: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  datetime: string;
  status: "programada" | "completada" | "cancelada" | "confirmada";
  reason: string;
  notes?: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  toSpecialty: string;
  date: string;
  notes: string;
  summary: string;
  status?: "enviada" | "pendiente" | "aceptada";
  attachments?: PatientFile[];
}

export interface PatientFile {
  id: string;
  patientId: string;
  name: string;
  type: "estudio" | "análisis" | "receta" | "imagen" | "otro";
  date: string;
  size: string;
  notes?: string;
}

export const patientFiles: PatientFile[] = [
  { id: "f1", patientId: "1", name: "Hemoglobina_glucosilada_Mar2026.pdf", type: "análisis", date: "2026-03-15", size: "245 KB", notes: "HbA1c: 8.2%" },
  { id: "f2", patientId: "1", name: "Perfil_lipídico_Feb2026.pdf", type: "análisis", date: "2026-02-18", size: "180 KB", notes: "Colesterol total: 240, Triglicéridos: 198" },
  { id: "f3", patientId: "1", name: "Electrocardiograma_Ene2026.pdf", type: "estudio", date: "2026-01-10", size: "1.2 MB" },
  { id: "f4", patientId: "6", name: "Espirometria_Ago2024.pdf", type: "estudio", date: "2024-08-15", size: "890 KB", notes: "FEV1 72% del predicho" },
  { id: "f5", patientId: "6", name: "Rx_torax_Ene2025.jpg", type: "imagen", date: "2025-01-20", size: "3.4 MB", notes: "Hiperinsuflación leve, sin infiltrados" },
  { id: "f6", patientId: "9", name: "Creatinina_Mar2026.pdf", type: "análisis", date: "2026-03-17", size: "120 KB", notes: "Creatinina: 1.8 mg/dL" },
  { id: "f7", patientId: "5", name: "Densitometria_osea_2025.pdf", type: "estudio", date: "2025-03-10", size: "2.1 MB", notes: "Osteopenia en columna lumbar" },
  { id: "f8", patientId: "3", name: "Diario_cefaleas_Feb2026.pdf", type: "otro", date: "2026-02-28", size: "85 KB" },
];

export const patients: Patient[] = [
  {
    id: "1",
    name: "María García López",
    age: 45,
    sex: "F",
    phone: "+52 55 1234 5678",
    email: "maria.garcia@gmail.com",
    lastVisit: "2026-03-20",
    nextAppointment: "2026-03-25",
    status: "activo",
    conditions: ["Hipertensión arterial sistémica", "Diabetes mellitus tipo 2"],
    bloodType: "O+",
    allergies: ["Penicilina"],
    insuranceProvider: "GNP Seguros",
    emergencyContact: "Juan García — Esposo — (55) 9988-7766",
  },
  {
    id: "2",
    name: "Carlos Hernández Ruiz",
    age: 62,
    sex: "M",
    phone: "+52 55 9876 5432",
    email: "carlos.hernandez@outlook.com",
    lastVisit: "2026-03-18",
    nextAppointment: "2026-03-27",
    status: "activo",
    conditions: ["Artritis reumatoide", "Hipercolesterolemia"],
    bloodType: "A+",
    allergies: [],
    insuranceProvider: "Metlife",
    emergencyContact: "Rosa Ruiz — Esposa — (55) 3344-5566",
  },
  {
    id: "3",
    name: "Ana Martínez Soto",
    age: 33,
    sex: "F",
    phone: "+52 55 5555 1234",
    email: "ana.martinez@gmail.com",
    lastVisit: "2026-03-15",
    nextAppointment: "2026-03-28",
    status: "activo",
    conditions: ["Migraña crónica"],
    bloodType: "B+",
    allergies: ["Sulfonamidas"],
    insuranceProvider: "AXA Seguros",
    emergencyContact: "Pedro Martínez — Padre — (55) 2211-4433",
  },
  {
    id: "4",
    name: "Roberto Sánchez Díaz",
    age: 28,
    sex: "M",
    phone: "+52 55 4444 3333",
    email: "roberto.sanchez@yahoo.com",
    lastVisit: "2026-02-10",
    status: "inactivo",
    conditions: [],
    bloodType: "AB+",
    allergies: [],
    emergencyContact: "Lucía Díaz — Madre — (55) 6677-8899",
  },
  {
    id: "5",
    name: "Laura Pérez Vega",
    age: 55,
    sex: "F",
    phone: "+52 55 2222 8888",
    email: "laura.perez@gmail.com",
    lastVisit: "2026-03-22",
    nextAppointment: "2026-03-24",
    status: "activo",
    conditions: ["Hipotiroidismo", "Osteoporosis", "Dislipidemia"],
    bloodType: "O-",
    allergies: ["AINEs", "Mariscos"],
    insuranceProvider: "Mapfre",
    emergencyContact: "Miguel Vega — Hijo — (55) 1122-3344",
  },
  {
    id: "6",
    name: "Fernando Torres Méndez",
    age: 41,
    sex: "M",
    phone: "+52 55 7777 6666",
    email: "fernando.torres@hotmail.com",
    lastVisit: "2026-03-19",
    nextAppointment: "2026-03-26",
    status: "activo",
    conditions: ["Asma bronquial"],
    bloodType: "A-",
    allergies: ["Aspirina"],
    insuranceProvider: "GNP Seguros",
    emergencyContact: "Patricia Méndez — Esposa — (55) 5566-7788",
  },
  {
    id: "7",
    name: "Gabriela Morales Ríos",
    age: 38,
    sex: "F",
    phone: "+52 55 3333 9999",
    email: "gaby.morales@gmail.com",
    lastVisit: "2026-03-22",
    status: "activo",
    conditions: ["Ansiedad generalizada", "Gastritis crónica"],
    bloodType: "B-",
    allergies: [],
    insuranceProvider: "AXA Seguros",
  },
  {
    id: "8",
    name: "Diego Ramírez Flores",
    age: 7,
    sex: "M",
    phone: "+52 55 1111 2222",
    email: "mama.diego@gmail.com",
    lastVisit: "2026-03-21",
    nextAppointment: "2026-03-29",
    status: "activo",
    conditions: ["Rinitis alérgica"],
    bloodType: "O+",
    allergies: ["Amoxicilina"],
    emergencyContact: "Sofía Flores — Madre — (55) 8899-0011",
  },
  {
    id: "9",
    name: "Patricia Juárez Castillo",
    age: 71,
    sex: "F",
    phone: "+52 55 4455 6677",
    email: "patricia.juarez@gmail.com",
    lastVisit: "2026-03-17",
    status: "activo",
    conditions: ["Hipertensión arterial", "Insuficiencia renal crónica estadio 2", "Diabetes mellitus tipo 2"],
    bloodType: "A+",
    allergies: ["Metamizol"],
    insuranceProvider: "IMSS",
    emergencyContact: "Carmen Castillo — Hija — (55) 7788-9900",
  },
  {
    id: "10",
    name: "Nuevo Paciente (Sin historial)",
    age: 0,
    sex: "M",
    phone: "",
    email: "",
    lastVisit: "",
    status: "activo",
    conditions: [],
    bloodType: undefined,
    allergies: [],
  },
];

export const clinicalNotes: ClinicalNote[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "María García López",
    date: "2026-03-20",
    inputType: "texto",
    rawInput: "Paciente refiere dolor de cabeza frecuente y presión arterial elevada en casa. Toma losartán 50mg. Glucosa en ayunas 145 mg/dL.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nControl de hipertensión arterial y diabetes mellitus tipo 2.\n\n**PADECIMIENTO ACTUAL:**\nPaciente femenina de 45 años con diagnóstico de HAS y DM2 de 5 años de evolución. Refiere cefalea frontal intermitente de intensidad 6/10 en las últimas 2 semanas, asociada a cifras tensionales elevadas en domicilio (promedio 150/95 mmHg). Actualmente con losartán 50 mg c/24h. Refiere adherencia regular al tratamiento. Glucosa capilar en ayunas en domicilio: 145 mg/dL.\n\n**EXPLORACIÓN FÍSICA:**\n• TA: 150/95 mmHg | FC: 78 lpm | FR: 18 rpm | Temp: 36.5°C | Peso: 72 kg\n• General: Consciente, orientada, buen estado general\n• Cardiovascular: Ruidos cardíacos rítmicos, sin soplos\n• Neurológico: Sin focalización, reflejos normales\n\n**DIAGNÓSTICO:**\n1. Hipertensión arterial sistémica no controlada (I10)\n2. Diabetes mellitus tipo 2 con control subóptimo (E11.65)\n\n**PLAN:**\n1. Aumentar losartán a 100 mg/día\n2. Solicitar: HbA1c, perfil lipídico, creatinina, EGO\n3. Reforzar medidas higiénico-dietéticas\n4. Cita de seguimiento en 4 semanas\n5. Datos de alarma explicados",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "2",
    patientId: "1",
    patientName: "María García López",
    date: "2026-02-18",
    inputType: "texto",
    rawInput: "Revisión de laboratorios. HbA1c 8.2%, colesterol total 240, triglicéridos 198. Refiere buena adherencia a metformina.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nRevisión de estudios de laboratorio de control.\n\n**PADECIMIENTO ACTUAL:**\nPaciente acude a revisión de resultados de laboratorio solicitados en consulta previa. Refiere buena adherencia a metformina 850mg c/12h. Sin episodios de hipoglucemia. Dieta irregular.\n\n**RESULTADOS DE LABORATORIO:**\n• HbA1c: 8.2% (Meta: <7%)\n• Glucosa en ayunas: 148 mg/dL\n• Colesterol total: 240 mg/dL\n• LDL: 155 mg/dL\n• HDL: 38 mg/dL\n• Triglicéridos: 198 mg/dL\n• Creatinina: 0.9 mg/dL\n\n**DIAGNÓSTICO:**\n1. DM2 en descontrol metabólico\n2. Dislipidemia mixta\n\n**PLAN:**\n1. Continuar metformina 850mg c/12h\n2. Iniciar atorvastatina 20mg c/24h\n3. Referir a nutrición clínica\n4. Control de laboratorio en 3 meses",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "3",
    patientId: "1",
    patientName: "María García López",
    date: "2026-01-10",
    inputType: "voz",
    rawInput: "Primera consulta del año. Paciente viene a chequeo general. Sin quejas nuevas. Solicitar laboratorios de rutina.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nChequeo general anual.\n\n**PADECIMIENTO ACTUAL:**\nPaciente femenina de 45 años acude a consulta de revisión de inicio de año. Niega sintomatología nueva. Continúa con tratamiento habitual. Refiere caminar 20 minutos 3 veces por semana.\n\n**EXPLORACIÓN FÍSICA:**\n• TA: 140/88 mmHg | FC: 74 lpm | Peso: 73 kg | IMC: 28.4\n• Sin hallazgos patológicos nuevos\n\n**DIAGNÓSTICO:**\n1. HAS en tratamiento\n2. DM2 en tratamiento\n\n**PLAN:**\n1. Solicitar BH, QS, HbA1c, perfil lipídico, EGO, perfil tiroideo\n2. Continuar tratamiento actual\n3. Cita con resultados en 3 semanas",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "4",
    patientId: "3",
    patientName: "Ana Martínez Soto",
    date: "2026-03-15",
    inputType: "voz",
    rawInput: "Ana viene por migraña recurrente, tres episodios por semana, no responde bien a paracetamol. Quiere explorar tratamiento preventivo.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nMigraña recurrente sin respuesta a analgésicos convencionales.\n\n**PADECIMIENTO ACTUAL:**\nPaciente femenina de 33 años con migraña sin aura de 2 años de evolución. Refiere 3 episodios por semana, duración 4-8 horas, localización hemicraneal derecha, pulsátil, intensidad 8/10, con fotofobia y náusea. Sin respuesta adecuada a paracetamol 1g. Identifica estrés laboral y falta de sueño como desencadenantes.\n\n**EXPLORACIÓN FÍSICA:**\n• Signos vitales normales\n• Exploración neurológica sin alteraciones\n• Pares craneales íntegros\n• Sin signos meníngeos\n\n**DIAGNÓSTICO:**\n1. Migraña sin aura, alta frecuencia (G43.0)\n2. Candidata a profilaxis migrañosa\n\n**PLAN:**\n1. Iniciar topiramato 25 mg/noche, escalar a 50 mg en 2 semanas\n2. Sumatriptán 50 mg como rescate (máx 2 días/semana)\n3. Diario de cefaleas\n4. Higiene del sueño\n5. Reevaluación en 6 semanas\n6. Si no mejora → referir a Neurología",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "5",
    patientId: "5",
    patientName: "Laura Pérez Vega",
    date: "2026-03-22",
    inputType: "texto",
    rawInput: "Revisión de rutina. Refiere cansancio y dolor articular. Última densitometría hace 1 año mostró osteopenia.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nRevisión de seguimiento por hipotiroidismo y osteoporosis.\n\n**PADECIMIENTO ACTUAL:**\nPaciente femenina de 55 años acude a revisión. Refiere fatiga persistente de 3 semanas y artralgias generalizadas, predominio en manos y rodillas. Antecedente de osteopenia diagnosticada en 2025. Tratamiento actual: levotiroxina 75 mcg/día.\n\n**EXPLORACIÓN FÍSICA:**\n• TA: 128/82 mmHg | FC: 68 lpm | Peso: 65 kg\n• Tiroides: No palpable, sin nódulos\n• Articulaciones: Sin datos de sinovitis activa\n• Piel seca, cabello quebradizo\n\n**RESULTADOS:**\n• TSH: 6.8 mUI/L (elevada — meta: 0.5-4.5)\n\n**DIAGNÓSTICO:**\n1. Hipotiroidismo subclínico sintomático (E02)\n2. Osteopenia en seguimiento\n3. Dislipidemia\n\n**PLAN:**\n1. Aumentar levotiroxina a 100 mcg/día\n2. Solicitar densitometría ósea de control\n3. Calcio 600 mg + Vitamina D 800 UI diario\n4. Perfil tiroideo de control en 6 semanas\n5. Referir a Reumatología si persisten artralgias",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "6",
    patientId: "6",
    patientName: "Fernando Torres Méndez",
    date: "2026-03-19",
    inputType: "texto",
    rawInput: "Control de asma. Refiere aumento de sibilancias por exposición a polvo en remodelación de su casa. Usa salbutamol 4-5 veces al día.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nExacerbación de asma bronquial.\n\n**PADECIMIENTO ACTUAL:**\nPaciente masculino de 41 años con asma bronquial de 5 años de evolución. Incremento de disnea y sibilancias de 3 días, asociado a exposición a polvo por remodelación domiciliaria. Uso aumentado de salbutamol de rescate (4-5 inh/día vs 1-2 habituales). Niega fiebre o expectoración purulenta.\n\n**EXPLORACIÓN FÍSICA:**\n• TA: 120/78 mmHg | FC: 88 lpm | FR: 22 rpm | SatO₂: 94%\n• Tórax: Sibilancias espiratorias bilaterales\n• Sin uso de músculos accesorios\n\n**DIAGNÓSTICO:**\n1. Exacerbación leve-moderada de asma bronquial (J45.1)\n\n**PLAN:**\n1. Nebulización en consultorio: salbutamol 2.5mg + ipratropio 500mcg\n2. Iniciar budesonida/formoterol 160/4.5 mcg c/12h\n3. Mantener salbutamol de rescate PRN\n4. Evitar exposición a polvo, usar cubrebocas\n5. Espirometría de control si no mejora en 2 semanas\n6. Control en 7 días",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "7",
    patientId: "9",
    patientName: "Patricia Juárez Castillo",
    date: "2026-03-17",
    inputType: "texto",
    rawInput: "Paciente de 71 años con IRC estadio 2, DM2 e hipertensión. Viene por edema de miembros inferiores bilateral. Creatinina 1.8.",
    aiOutput: "**MOTIVO DE CONSULTA:**\nEdema de miembros inferiores bilateral de reciente aparición.\n\n**PADECIMIENTO ACTUAL:**\nPaciente femenina de 71 años con antecedentes de IRC estadio 2, DM2 e HAS. Presenta edema bilateral de miembros inferiores de 10 días de evolución, progresivo, sin dolor. Refiere disnea de medianos esfuerzos. Tratamiento: enalapril 10mg c/12h, metformina 500mg c/12h, furosemida 20mg c/24h.\n\n**EXPLORACIÓN FÍSICA:**\n• TA: 148/92 mmHg | FC: 82 lpm | Peso: 78 kg (+3 kg vs última consulta)\n• Edema bilateral con godete ++, hasta tercio medio de piernas\n• Campos pulmonares sin estertores\n• Ingurgitación yugular dudosa\n\n**RESULTADOS:**\n• Creatinina: 1.8 mg/dL | TFG estimada: 38 mL/min\n• BUN: 32 mg/dL\n• Albúmina: 3.2 g/dL\n\n**DIAGNÓSTICO:**\n1. ERC probable progresión a estadio 3b (N18.4)\n2. Síndrome edematoso en estudio\n3. HAS no controlada\n4. DM2\n\n**PLAN:**\n1. Aumentar furosemida a 40 mg c/12h\n2. Restricción hídrica 1.5L/día y sodio <2g/día\n3. Solicitar: BH, QS completa, EGO, proteínas en orina 24h, ecocardiograma\n4. Referencia urgente a Nefrología\n5. Control en 1 semana con resultados",
    format: "Estructurado",
    doctorName: "Dr. Alejandro Ramírez",
  },
];

export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "5",
    patientName: "Laura Pérez Vega",
    datetime: "2026-03-24T09:00",
    status: "confirmada",
    reason: "Seguimiento hipotiroidismo — resultados de laboratorio",
    notes: "Traer resultados de perfil tiroideo",
  },
  {
    id: "2",
    patientId: "1",
    patientName: "María García López",
    datetime: "2026-03-25T10:30",
    status: "confirmada",
    reason: "Control hipertensión y diabetes — revisión de labs",
    notes: "Revisar HbA1c y perfil lipídico",
  },
  {
    id: "3",
    patientId: "6",
    patientName: "Fernando Torres Méndez",
    datetime: "2026-03-26T12:00",
    status: "programada",
    reason: "Control de asma — seguimiento post-exacerbación",
  },
  {
    id: "4",
    patientId: "2",
    patientName: "Carlos Hernández Ruiz",
    datetime: "2026-03-27T09:30",
    status: "programada",
    reason: "Revisión artritis reumatoide — control de dolor",
  },
  {
    id: "5",
    patientId: "3",
    patientName: "Ana Martínez Soto",
    datetime: "2026-03-28T11:00",
    status: "programada",
    reason: "Seguimiento migraña — evaluación profilaxis",
  },
  {
    id: "6",
    patientId: "8",
    patientName: "Diego Ramírez Flores",
    datetime: "2026-03-29T10:00",
    status: "programada",
    reason: "Control pediátrico — rinitis alérgica",
  },
  {
    id: "7",
    patientId: "6",
    patientName: "Fernando Torres Méndez",
    datetime: "2026-03-19T14:00",
    status: "completada",
    reason: "Exacerbación asmática — consulta urgente",
  },
  {
    id: "8",
    patientId: "2",
    patientName: "Carlos Hernández Ruiz",
    datetime: "2026-03-18T09:30",
    status: "completada",
    reason: "Revisión artritis — ajuste metotrexato",
  },
  {
    id: "9",
    patientId: "1",
    patientName: "María García López",
    datetime: "2026-03-20T11:00",
    status: "completada",
    reason: "Control HAS y DM2 — cifras elevadas",
  },
  {
    id: "10",
    patientId: "7",
    patientName: "Gabriela Morales Ríos",
    datetime: "2026-03-22T16:00",
    status: "completada",
    reason: "Consulta por ansiedad y síntomas gástricos",
  },
  {
    id: "11",
    patientId: "4",
    patientName: "Roberto Sánchez Díaz",
    datetime: "2026-02-10T10:00",
    status: "cancelada",
    reason: "Chequeo general — paciente no asistió",
  },
];

export const referrals: Referral[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "María García López",
    toSpecialty: "Endocrinología",
    date: "2026-03-20",
    notes: "Diabetes tipo 2 con control subóptimo (HbA1c 8.2%) a pesar de metformina 850mg c/12h.",
    summary: "Paciente femenina de 45 años con DM2 de 5 años de evolución. HbA1c última: 8.2%. Requiere valoración para posible inicio de segundo antidiabético o insulinización. Comorbilidades: HAS, dislipidemia.",
    status: "enviada",
  },
  {
    id: "2",
    patientId: "5",
    patientName: "Laura Pérez Vega",
    toSpecialty: "Reumatología",
    date: "2026-03-22",
    notes: "Artralgias generalizadas persistentes de 3 meses, predominio en manos y rodillas. Descartar causa autoinmune.",
    summary: "Paciente femenina de 55 años con osteopenia, hipotiroidismo y artralgias de 3 meses de evolución sin respuesta a analgésicos. Solicito valoración reumatológica para descartar artritis reumatoide u otra patología autoinmune.",
    status: "pendiente",
  },
  {
    id: "3",
    patientId: "9",
    patientName: "Patricia Juárez Castillo",
    toSpecialty: "Nefrología",
    date: "2026-03-17",
    notes: "IRC con probable progresión. Creatinina 1.8, TFG estimada 38 mL/min. Edema bilateral progresivo.",
    summary: "Paciente femenina de 71 años con IRC, DM2 e HAS. Creatinina en ascenso (1.8 mg/dL), TFG 38 mL/min. Síndrome edematoso bilateral de reciente aparición. Solicito valoración urgente por nefrología para ajuste de manejo y determinar estadio actual.",
    status: "enviada",
  },
];
