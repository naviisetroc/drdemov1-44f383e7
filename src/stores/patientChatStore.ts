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

function load(): PatientChatStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { chatPatients: [], chatAppointments: [] };
}

function save(store: PatientChatStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
