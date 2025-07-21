import mongoose from "mongoose";
import dotenv from "dotenv";
import {UserProfile} from "../models/profile.model";
import { generateEmbedding } from "../utils/embedding";
import { getNextSequence } from "../utils/getNextSequence";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const categories = [
  {
    title: "developer",
    bios: [
      "Fullstack developer building scalable web applications.",
      "Experienced software developer working on microservices.",
      "Backend developer focusing on Node.js and MongoDB.",
      "Developer with interest in distributed systems and APIs."
    ],
    interests: ["coding", "backend", "system design"],
  },
  {
    title: "react",
    bios: [
      "React developer focused on UI/UX design.",
      "Building SPAs with React and Redux.",
      "Frontend developer with React experience.",
      "React + TypeScript enthusiast creating scalable apps."
    ],
    interests: ["frontend", "design", "redux", "typescript"],
  },
  {
    title: "c++",
    bios: [
      "C++ developer working on high-performance systems.",
      "Competitive programmer with C++ expertise.",
      "Game developer using C++ and Unreal Engine.",
      "Low-level systems developer focused on C++ and memory management."
    ],
    interests: ["competitive coding", "systems programming", "games"],
  },
  {
    title: "teacher",
    bios: [
      "Math teacher with 5 years experience.",
      "CS teacher passionate about student growth.",
      "High school teacher guiding students in STEM.",
      "Coding mentor and teacher helping beginners."
    ],
    interests: ["education", "mentoring", "students"],
  },
  {
    title: "sports",
    bios: [
      "Football coach and sports strategist.",
      "Fitness trainer promoting healthy lifestyle.",
      "Basketball enthusiast sharing workout tips.",
      "Sports journalist covering international events."
    ],
    interests: ["fitness", "coaching", "health"],
  },
  {
    title: "astrologer",
    bios: [
      "Astrologer with 10+ years in Vedic astrology.",
      "Reading birth charts and offering predictions.",
      "Astrology + mindfulness practitioner.",
      "Zodiac and planetary alignment expert."
    ],
    interests: ["astrology", "spirituality", "horoscope"],
  },
  {
    title: "ai researcher",
    bios: [
      "AI researcher working on large language models.",
      "Machine learning enthusiast training custom models.",
      "Deep learning expert exploring NLP tasks.",
      "Building intelligent agents with reinforcement learning."
    ],
    interests: ["ml", "deep learning", "nlp", "research"],
  }
];

const firstNames = ["Akash", "John", "Aisha", "Meena", "Liam", "Olivia", "Ethan", "Sophia"];
const lastNames = ["Bhuker", "Sharma", "Smith", "Kumar", "Lee", "Gupta", "Johnson", "Bose"];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await UserProfile.deleteMany({});
    console.log("Cleared existing profiles");

    const usersToInsert = [];

    for (const category of categories) {
      for (const bio of category.bios) {
        const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
        const profession = category.title;
        const location = "Remote";
        const interests = category.interests;
        const fullText = `${name} ${bio} ${interests.join(" ")}`;
        const embedding = await generateEmbedding(fullText);
        
        usersToInsert.push({
          userId: await getNextSequence("userId"),
          name,
          bio,
          location,
          profession,
          interests,
          socialLinks: {
            linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(" ", "")}`,
          },
          embedding: Array.from(embedding),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    
    console.log("fegrthgefwfgrtefgr", usersToInsert);
    await UserProfile.insertMany(usersToInsert);
    console.log(`✅ Inserted ${usersToInsert.length} user profiles`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
