import { useState, useEffect, useCallback } from "react";
import { getChatPatients, getChatAppointments, STORE_UPDATE_EVENT, ChatPatient } from "@/stores/patientChatStore";
import { Appointment } from "@/data/mockData";

export function useStoreSync() {
  const [chatPatients, setChatPatients] = useState<ChatPatient[]>(getChatPatients);
  const [chatAppointments, setChatAppointments] = useState<Appointment[]>(getChatAppointments);

  const refresh = useCallback(() => {
    setChatPatients(getChatPatients());
    setChatAppointments(getChatAppointments());
  }, []);

  useEffect(() => {
    window.addEventListener(STORE_UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(STORE_UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { chatPatients, chatAppointments, refresh };
}
