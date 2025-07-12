import { connect, disconnect } from 'mongoose';
import Patient from "../lib/models/Patient.mjs";

const humanNames = [
  "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah",
  "Ian", "Judy", "Kevin", "Laura", "Mike", "Nina", "Oscar", "Paula", "Quentin",
  "Rachel", "Steve", "Tina", "Umar", "Vera", "Will", "Xena", "Yuri", "Zoe",
  "Adam", "Bella", "Cody", "Derek", "Eva", "Frank", "Grace", "Harry", "Isla",
  "Jack", "Kara", "Leo", "Mona", "Nick", "Olga", "Pete", "Queen", "Ray", "Sara",
  "Tom", "Una", "Vic", "Wes", "Ximena"
];

const petNames = [
  "Fluffy", "Whiskers", "Goldie", "Buddy", "Max", "Bella", "Charlie", "Luna",
  "Rocky", "Milo", "Coco", "Ruby", "Oscar", "Misty", "Gizmo", "Daisy", "Shadow",
  "Pumpkin", "Lucky", "Sparky", "Simba", "Tiger", "Angel", "Bubbles", "Peanut",
  "Smokey", "Pepper", "Mocha", "Penny", "Boomer", "Mochi", "Nala", "Rex",
  "Rusty", "Scout", "Snickers", "Teddy", "Thor", "Waffles", "Zeus", "Chloe",
  "Fuzzy", "Oreo", "Poppy", "Maple", "Mango", "Pickles", "Blue", "Ash", "Snow"
];

const petTypes = [
  "Dog", "Cat", "Fish", "Rabbit", "Bird", "Hamster", "Guinea Pig", "Turtle",
  "Lizard", "Snake", "Frog", "Ferret", "Hedgehog", "Horse", "Goat"
];

function randomBirthDate(maxYears = 15) {
  const now = new Date();
  const pastTime = now.getTime() - Math.random() * (maxYears * 365 * 24 * 60 * 60 * 1000);
  return new Date(pastTime);
}

function calculateAge(birthDate) {
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function seed() {
  const MONGODB_URI = 'mongodb://localhost:27017/patient';

  await connect(MONGODB_URI);
  console.log("🌱 Connected to DB");

  await Patient.deleteMany({});
  console.log("🗑 Existing patients removed");


  const patients = [];
  for (let i = 0; i < 200; i++) {
    const name = humanNames[Math.floor(Math.random() * humanNames.length)];
    const phone = `+972-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const petName = petNames[Math.floor(Math.random() * petNames.length)];
    const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
    const petBirthDate = randomBirthDate(15);
    const petAge = calculateAge(petBirthDate);

    patients.push({
      name,
      phone,
      petName,
      petType,
      petBirthDate,
      petAge
    });
  }

  await Patient.insertMany(patients);
  console.log(`✅ Seeded ${patients.length} patients`);
  await disconnect();
}

seed().catch((err) => {
  console.error("🚨 Seed failed:", err);
  disconnect();
});
