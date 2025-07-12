"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatients, deletePatient, addPatient, updatePatient } from "@/lib/api";
import { IPatient } from "@/lib/interfaces";
import { useState } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import styles from './PetClinicTable.module.css';
import PatientModal from '../PatientModal/PatientModal';

export default function PetClinicTable() {
  const queryClient = useQueryClient();

  const [selectedPatient, setSelectedPatient] = useState<IPatient | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  const { mutate: removePatient } = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const { mutate: createPatient } = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const { mutate: modifyPatient } = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const [ownerFilter, setOwnerFilter] = useState("");
  const [petNameFilter, setPetNameFilter] = useState("");
  const [petTypeFilter, setPetTypeFilter] = useState("");

  const petTypes = Array.from(
    new Set(patients?.map((patient) => patient.petType))
  );

  const filteredPatients = patients?.filter(patient => {
    const matchesOwner = patient.name.toLowerCase().includes(ownerFilter.toLowerCase());
    const matchesPetName = patient.petName.toLowerCase().includes(petNameFilter.toLowerCase());
    const matchesPetType = !petTypeFilter || patient.petType === petTypeFilter;
    return matchesOwner && matchesPetName && matchesPetType;
  });

  const handleEditClick = (patient: IPatient) => {
    setSelectedPatient(patient);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedPatient(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  if (isLoading) return <div className={styles.tableLoadingText}>Loading patients...</div>;

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Patients</h2>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableCell}>
              Owner
              <input
                type="text"
                placeholder="Filter by owner"
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className={styles.filterInput}
              />
            </th>
            <th className={styles.tableCell}>Phone</th>
            <th className={styles.tableCell}>
              Pet Name
              <input
                type="text"
                placeholder="Filter by pet name"
                value={petNameFilter}
                onChange={(e) => setPetNameFilter(e.target.value)}
                className={styles.filterInput}
              />
            </th>
            <th className={styles.tableCell}>Pet Age</th>
            <th className={styles.tableCell}>
              Pet Type
              <select
                value={petTypeFilter}
                onChange={(e) => setPetTypeFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                {petTypes.map((petType, index) => (
                  <option key={index} value={petType}>
                    {petType}
                  </option>
                ))}
              </select>
            </th>
            <th className={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients?.map((patient) => (
            <tr key={patient._id} className={styles.tableRow}>
              <td className={styles.tableCell}>{patient.name}</td>
              <td className={styles.tableCell}>{patient.phone}</td>
              <td className={styles.tableCell}>{patient.petName}</td>
              <td className={styles.tableCell}>{patient.petAge}</td>
              <td className={styles.tableCell}>{patient.petType}</td>
              <td className={styles.tableCell}>
                <div className={styles.tableActionsCell}>
                  <button onClick={() => handleEditClick(patient)}>
                    <Edit size={20} />
                  </button>
                  <button onClick={() => removePatient(patient._id!)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filteredPatients?.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.noPatients}>
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleAddClick} className={styles.addPatientButton}>
        <PlusCircle size={32} /> Add Patient
      </button>
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (modalMode === "add") {
            createPatient(data);
          } else if (modalMode === "edit" && data._id) {
            modifyPatient(data);
          }
          setIsModalOpen(false);
        }}
        petTypes={petTypes}
        mode={modalMode}
        patient={selectedPatient}
        onDelete={() => {
          if (selectedPatient) {
            removePatient(selectedPatient._id!);
            setIsModalOpen(false);
          }
        }}
      />
    </div>
  );
}
