import { Patient, Appointment } from "@/data/mockData";

export interface ChatPatient {
  id: string;
  name: string;
  age: number;
  sex: "M" | "F";
  phone: string;
  reason: string;
  symptoms: string;
  history: string;
  summary: string;
  createdAt: string;
}

interface PatientChatStore {
  chatPatients: ChatPatient[];
  chatAppointments: Appointment[];
}

const STORAGE_KEY = "medisec_chat_data";
const STORE_EVENT = "medisec_store_updated";

// Pre-seeded data: 3 patients from chat + 2 appointments
const SEED_DATA: PatientChatStore = {
  chatPatients: [
    {
      id: "chat-seed-1",
      name: "Ricardo Mendoza Aguilar",
      age: 52,
      sex: "M",
      phone: "+52 55 6543 2100",
      reason: "Dolor estomacal recurrente",
      symptoms: "Dolor epigástrico tipo ardoroso de 2 semanas, empeora después de comer, acidez nocturna, náuseas ocasionales. Intensidad 7/10.",
      history: "Gastritis hace 3 años tratada con omeprazol. Sin alergias conocidas. Toma ibuprofeno frecuentemente por dolor de espalda.",
      summary: "Paciente masculino de 52 años.\n\n**Motivo de consulta:** Dolor estomacal recurrente\n**Síntomas:** Dolor epigástrico ardoroso 2 semanas, acidez, náuseas\n**Antecedentes:** Gastritis previa, uso frecuente de AINEs",
      createdAt: "2026-03-23T14:30:00.000Z",
    },
    {
      id: "chat-seed-2",
      name: "Valentina Cruz Ortega",
      age: 29,
      sex: "F",
      phone: "+52 55 7890 1234",
      reason: "Revisión general y planificación familiar",
      symptoms: "Sin síntomas agudos. Desea consejería sobre métodos anticonceptivos y realizar chequeo general de rutina.",
      history: "Sana. Sin enfermedades crónicas. Sin alergias. Sin cirugías previas. Última revisión ginecológica hace 2 años.",
      summary: "Paciente femenina de 29 años.\n\n**Motivo de consulta:** Revisión general y planificación familiar\n**Síntomas:** Asintomática\n**Antecedentes:** Sana, sin patologías conocidas",
      createdAt: "2026-03-23T16:45:00.000Z",
    },
    {
      id: "chat-seed-3",
      name: "Emilio Vargas Luna",
      age: 67,
      sex: "M",
      phone: "+52 55 3210 5678",
      reason: "Dificultad para respirar al caminar",
      symptoms: "Disnea de medianos esfuerzos de 1 mes de evolución, tos seca matutina, fatiga al subir escaleras. Ex-fumador (dejó hace 5 años, fumó 30 años).",
      history: "EPOC diagnosticado hace 2 años. Hipertensión arterial controlada con amlodipino 5mg. Exfumador. Sin alergias medicamentosas.",
      summary: "Paciente masculino de 67 años.\n\n**Motivo de consulta:** Disnea progresiva\n**Síntomas:** Disnea de esfuerzo, tos seca, fatiga\n**Antecedentes:** EPOC, HAS, exfumador 30 años",
      createdAt: "2026-03-24T08:15:00.000Z",
    },
  ],
  chatAppointments: [
    {
      id: "apt-seed-1",
      patientId: "chat-seed-1",
      patientName: "Ricardo Mendoza Aguilar",
      datetime: "2026-03-25T14:00",
      status: "programada",
      reason: "Dolor estomacal recurrente",
      notes: "Registrado vía chat. Síntomas: dolor epigástrico, acidez, náuseas. Uso frecuente de AINEs.",
    },
    {
      id: "apt-seed-3",
      patientId: "chat-seed-3",
      patientName: "Emilio Vargas Luna",
      datetime: "2026-03-26T09:00",
      status: "programada",
      reason: "Dificultad respiratoria — EPOC en seguimiento",
      notes: "Registrado vía chat. Disnea progresiva, exfumador, EPOC conocido.",
    },
  ],
};

function load(): PatientChatStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PatientChatStore;
      // Ensure seeded patients exist
      if (parsed.chatPatients && parsed.chatPatients.length > 0) return parsed;
    }
  } catch {}
  // Initialize with seed data
  save(SEED_DATA);
  return { ...SEED_DATA };
}

function save(store: PatientChatStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  // Dispatch custom event for cross-component reactivity
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

export function addChatPatient(p: ChatPatient): void {
  const store = load();
  store.chatPatients.push(p);
  save(store);
}

export function addChatAppointment(a: Appointment): void {
  const store = load();
  store.chatAppointments.push(a);
  save(store);
}

export function getChatPatients(): ChatPatient[] {
  return load().chatPatients;
}

export function getChatAppointments(): Appointment[] {
  return load().chatAppointments;
}

export const STORE_UPDATE_EVENT = STORE_EVENT;

export function chatPatientToPatient(cp: ChatPatient): Patient {
  return {
    id: cp.id,
    name: cp.name,
    age: cp.age,
    sex: cp.sex,
    phone: cp.phone,
    email: "",
    lastVisit: "",
    nextAppointment: undefined,
    status: "activo",
    conditions: cp.reason ? [cp.reason] : [],
    bloodType: undefined,
    allergies: [],
  };
}
