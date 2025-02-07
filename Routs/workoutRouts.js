import express from 'express';
import { Workout } from '../Models/WorkoutModel.js';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config.js';

const router = express.Router();

router.post("/", async (request, response) => {
   console.log(request.body)
  try {

    const token = request.headers.authorization?.split(' ')[1]; 
      if (!token) {
        return response.status(401).send({ message: "Unauthorized" });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET); 
      const userId = decoded.id;
      console.log(userId)

    if ( 
         !request.body.workout ||
         !request.body.load ||
         !request.body.reps) {
      return response.status(400).send({message:"Send all required fields: workout, load, reps"})
    }

  
    const newWorkout = {
      workout: request.body.workout,
      load: request.body.load,
      reps: request.body.reps,
      userId,
    };
  
    const workout = await Workout.create(newWorkout);
    return response.status(201).send(workout);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ "message": error.message });
  }
});

router.get('/', async(request,response) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return response.status(401).send({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const workouts = await Workout.find({userId});
      return response.status(200).json({
        count: workouts.length,
        data: workouts
      })
    
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})



router.delete('/:id', async(request,response) => {
  try {
    const {id} = request.params;
 const result = await Workout.findByIdAndDelete(id);
 if(!result){
  return response.status(404).send({message: 'Workout not found'});
 }
 return response.status(200).send({message: 'Workout deleted successfully'});
  } catch (error) {
    console.log(error.message);
    response.status(500).send({message: error.message});
  }
});

export default router;