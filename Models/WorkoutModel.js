import mongoose from "mongoose";

const workoutschema = mongoose.Schema(
    {
        workout:{
            type: String,
            required: true,
        },
        load:{
            type: String,
            requored: true,
        },
        reps:{
            type: Number,
            required: true,
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true, 
        }
    },
    {
        timestamps: true,
    }
);
export const Workout = mongoose.model('myworkout', workoutschema);