import PetClinicTable from "./PetClinicTable/PetClinicTable";

export const PetClinicDashboard = () => {
  return (
    // Change whatever you want here. It's just an example of using tailwind
    <div className="grid grid-rows-auto-1fr gap-y-4 p-4 md:p-8">
      <Title />
      <PetClinicTable />
    </div>
  );
};

const Title = () => {
  return (
    <h1 className="text-primary font-bold text-3xl">Pet Clinic Dashboard</h1>
  );
};