export interface Prescription {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  medications: { name: string; dose: string; frequency: string; duration: string }[];
  notes?: string;
}

export interface Indication {
  id: string;
  patientId: string;
  date: string;
  title: string;
  details: string;
}

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx-1",
    patientId: "chat-seed-demo",
    date: "2026-03-20",
    doctorName: "Dr. Alejandro Ramírez",
    medications: [
      { name: "Ketorolaco", dose: "10 mg", frequency: "Cada 8 horas", duration: "5 días" },
      { name: "Celecoxib", dose: "200 mg", frequency: "Cada 12 horas", duration: "10 días" },
    ],
    notes: "Tomar con alimentos. Suspender si hay molestias gástricas.",
  },
  {
    id: "rx-2",
    patientId: "chat-seed-demo",
    date: "2026-03-25",
    doctorName: "Dr. Alejandro Ramírez",
    medications: [
      { name: "Paracetamol", dose: "500 mg", frequency: "Cada 6 horas si hay dolor", duration: "7 días" },
    ],
    notes: "Analgésico de mantenimiento post-rehabilitación.",
  },
];

export const mockIndications: Indication[] = [
  {
    id: "ind-1",
    patientId: "chat-seed-demo",
    date: "2026-03-20",
    title: "Cuidados post-artroscopia",
    details: "1. Aplicar hielo 20 min cada 4 horas las primeras 72 horas.\n2. Mantener la pierna elevada al descansar.\n3. No apoyar peso completo la primera semana.\n4. Usar muletas según indicación del fisioterapeuta.\n5. Acudir a rehabilitación 3 veces por semana.",
  },
  {
    id: "ind-2",
    patientId: "chat-seed-demo",
    date: "2026-03-25",
    title: "Ejercicios de rehabilitación — Semana 3",
    details: "1. Flexión y extensión pasiva de rodilla (3 series de 15 rep).\n2. Sentadillas parciales con apoyo (2 series de 10).\n3. Caminata en superficie plana 15-20 minutos.\n4. Evitar escaleras sin apoyo.\n5. Reportar cualquier inflamación excesiva o dolor agudo.",
  },
];

export function getPatientPrescriptions(patientId: string): Prescription[] {
  return mockPrescriptions.filter((p) => p.patientId === patientId);
}

export function getPatientIndications(patientId: string): Indication[] {
  return mockIndications.filter((i) => i.patientId === patientId);
}
