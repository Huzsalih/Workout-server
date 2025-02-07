import express, { request, response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/UserModel.js";
import { JWT_SECRET } from "../config.js";


const router = express.Router();

const generateToken = (userId) => {
    const payload={ id: userId }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
    });
};

//Route for user signup
router.post('/signup', async (request,response) => {

    try {
        const { email, password } = request.body;

        //check if the username or email already registered

        const existingUser = await User.findOne({$or: [ { email }] });

        if (existingUser){
            return response.status(400).json({message: 'username or email already registered'});
        }

        //hash the password

        const hashPassword = await bcrypt.hash(password, 10);
       // const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        //create a new user
        const newUser = await User.create({
            email,
            password: hashPassword,
         
        });

        await newUser.save();
        
        

        return response.status(201).json('User created!');
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message });
        
    }
});

//route for login
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser){
            return response.status(404).json({message: 'user not found'});
    } 
    

    //check if the password is correct

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if(!passwordMatch) {
        return response.status(401).json({message: 'Invalid password'}); 
    }

    const token = generateToken(existingUser._id);
    
    //Generate JWT token with userID included

   
    return response.status(200).json({ token, email:existingUser.email});

}catch (error) {

    console.log(error);
    response.status(500).send({message: error.message});  
}
});

export default router;