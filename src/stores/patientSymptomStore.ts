export interface SymptomAttachment {
  name: string;
  type: string;
  dataUrl: string; // base64 data URL
}

export interface SymptomEntry {
  id: string;
  patientId: string;
  text: string;
  intensity: number; // 1-10
  date: string; // ISO
  painType?: string;
  location?: string;
  duration?: string;
  history?: string;
  notes?: string;
  appointmentId?: string;
  attachments?: SymptomAttachment[];
}

const STORAGE_KEY = "medisec_patient_symptoms";

function load(): SymptomEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(entries: SymptomEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getPatientSymptoms(patientId: string): SymptomEntry[] {
  return load()
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addPatientSymptom(
  patientId: string,
  text: string,
  intensity: number,
  extra?: {
    painType?: string;
    location?: string;
    duration?: string;
    history?: string;
    notes?: string;
    appointmentId?: string;
    attachments?: SymptomAttachment[];
  }
): SymptomEntry {
  const entry: SymptomEntry = {
    id: `sym-${Date.now()}`,
    patientId,
    text,
    intensity,
    date: new Date().toISOString(),
    ...extra,
  };
  const all = load();
  all.push(entry);
  save(all);
  return entry;
}

export function deletePatientSymptom(id: string) {
  save(load().filter((e) => e.id !== id));
}
