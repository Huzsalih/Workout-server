import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import workoutRoutes from "./Routs/workoutRouts.js"
import userRoot from "./Routs/userRoute.js"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.urlencoded({extended:true})) 
// app.use( "/uploads", express.static(uploads)) 
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let corsOptions = {
  origin : ['http://localhost:5173', 'https://workout-client-mauve.vercel.app']
}

app.use(cors(corsOptions))

app.use(express.json());



app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN stack tutorial");
});

app.use('/workouts', workoutRoutes);
app.use('/user', userRoot);


mongoose
  .connect(mongoDBURL)

  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
