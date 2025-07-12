import axios from "axios";
import { IPatient } from "./interfaces";

export const getPatients = async (): Promise<IPatient[]> => {
  const res = await axios.get("/api/patients");
  return res.data.patients;
};

export const addPatient = async (patient: IPatient): Promise<IPatient> => {
  delete patient._id
  const res = await axios.post("/api/patients", patient);
  return res.data.patient;
};

export const updatePatient = async (patient: IPatient): Promise<IPatient> => {
  const id = patient._id
  delete patient._id
  const res = await axios.put(`/api/patients?id=${id}`, patient);
  return res.data.patient;
};

export const deletePatient = async (id: string): Promise<void> => {
  await axios.delete(`/api/patients?id=${id}`);
};
