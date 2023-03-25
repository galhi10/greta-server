import { MongoClient } from "mongodb";

console.log("Start DB Connection...");
const uri = "mongodb+srv://ItamarKfir:1234@itamarkfir.d1awrao.mongodb.net/test";
const db = new MongoClient(uri).db("Users");
console.log("Successfully connected to DB!");

export const login_Info_DB = db.collection("login_Info");
export const Configuration_DB = db.collection("Configuration");
export const Irrigation_Schedule_DB = db.collection("Irrigation_Schedule");
export const AVG_Irrigation_DB = db.collection("avg_irrigation_groups");