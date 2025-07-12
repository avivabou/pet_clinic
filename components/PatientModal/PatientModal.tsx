"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import styles from './PatientModal.module.css';
import { IPatient } from "@/lib/interfaces";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IPatient) => void;
  mode: "add" | "edit";
  patient?: IPatient;
  onDelete?: () => void;
  petTypes: string[];
}

export default function PatientModal({
  isOpen,
  onClose,
  onSave,
  mode,
  patient,
  onDelete,
  petTypes
}: PatientModalProps) {
  const [formData, setFormData] = useState<IPatient>({
    _id: "",
    name: "",
    phone: "+972",
    petName: "",
    petBirthDate: new Date(),
    petAge: 0,
    petType: "",
  });

  useEffect(() => {
    if (mode === "edit" && patient) {
      setFormData({
        _id: patient._id || "",
        name: patient.name || "",
        phone: patient.phone || "+972",
        petName: patient.petName || "",
        petBirthDate: patient.petBirthDate ? new Date(patient.petBirthDate) : new Date(),
        petAge: patient.petAge || 0,
        petType: patient.petType || "",
      });
    } else if (mode === "add") {
      setFormData({
        _id: "",
        name: "",
        phone: "+972",
        petName: "",
        petBirthDate: new Date(),
        petAge: 0,
        petType: "",
      });
    }
  }, [mode, patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "petBirthDate"
        ? new Date(value)
        : value
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      petBirthDate: new Date(formData.petBirthDate)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {mode === "add" ? (
            <>
              <div className={styles.iconWrapper}>
                <PlusCircle size={24} />
              </div>
              <h2>Add Patient</h2>
            </>
          ) : (
            <>
              <div className={styles.iconWrapper}>
                <Edit size={24} />
              </div>
              <h2>Edit Patient</h2>
              {onDelete && (
                <button className={styles.deleteButton} onClick={() => { onDelete(); onClose(); }}>
                  <Trash2 size={20} />
                </button>
              )}
            </>
          )}
        </div>

        <form className={styles.modalForm} onSubmit={e => e.preventDefault()}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Pet Name</label>
          <input
            type="text"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
          />

          <label>Pet Birth Date</label>
          <input
            type="date"
            name="petBirthDate"
            value={formData.petBirthDate.toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />

          <label>Pet Type</label>
          <select
            name="petType"
            value={formData.petType}
            onChange={handleChange}
            required
          >
            <option value="">Select Pet Type</option>
            {petTypes.map((type, i) => (
              <option key={i} value={type}>{type}</option>
            ))}
          </select>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.saveButton} onClick={handleSubmit}>
              {mode === "add" ? "Add" : "Edit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
