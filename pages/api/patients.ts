// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IPatient } from "@/lib/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Patient from "@/lib/models/Patient.mjs";

interface PatientResult {
  patients?: Array<IPatient> | IPatient;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PatientResult>,
) {
  if (req.method === "POST") {
    return await create(req, res);
  }
  if (req.method === "GET") {
    return await read(req, res);
  }
  if (req.method === "DELETE") {
    return await del(req, res);
  }
  if (req.method === "PUT") {
    return await update(req, res); 
  }
}

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ patient });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create patient" });
  }
};

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  try {
    const patients = await Patient.find({});
    res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load patients" });
  }
};

const del = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  try {
    const { id } = req.query;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete patient" });
  }
};

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  try {
    const { id } = req.query;
    const patientData = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(id, patientData, {
      new: true, 
      runValidators: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ patient: updatedPatient });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update patient" });
  }
};
