import * as mongoose from 'mongoose';


const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  petName: String,
  petAge: Number,
  petType: String,
  petBirthDate: Date,
}, { timestamps: true });

const Patient = (mongoose.models && mongoose.models.Patient) 
    || mongoose.model('Patient', PatientSchema);

export default Patient;