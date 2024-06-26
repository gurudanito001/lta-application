import { Request, Response } from 'express';
import {
  getAllMoods,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername
} from '../models/users.models';
import type { User } from '@prisma/client';
import { getUserFilters } from '../models/users.models';
import { uploadImage } from '../services/fileService';


export const getMoodsController =  async (req: Request, res: Response) => {
  try {
    const moods = await getAllMoods();
    res.status(200).json({ message: "Moods fetched successfully", payload: moods });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setTopicsController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    const updateData = req.body;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User topics updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setFeelingController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    const updateData = req.body;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User feeling updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setAvailabilityController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    const updateData = req.body;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User availability updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setProfileImageController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    const updateData = req.body as {profileImage: string};
    if(!updateData?.profileImage.includes("data:image")){
      return res.status(400).json({ message: "Base 64 image is required", status: "error" });
    }
    let result = await uploadImage({data: updateData?.profileImage });
    const updatedUser = await updateUser(id, {profileImage: result?.url})
    res.status(200).json({ message: "User updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const checkUsernameAvailability = async(req: Request | any, res: Response) => {
  try {
    const {username} = req.body
    const user = await getUserByUsername(username);
    if(user){
      res.status(400).json({ message: "Username has been taken", payload: {available: false} });
    }else{
      res.status(200).json({ message: "Username is available", payload: {available: true} });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getUsersController =  async (req: Request, res: Response) => {
  const {userType, country, gender, online, topics}: getUserFilters = req.query;
  try {
    const users = await getAllUsers({userType, country, gender, online, topics});
    res.status(200).json({ message: "Users fetched successfully", payload: users });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getUserByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (user) {
      res.status(200).json({ message: "User fetched successfully", payload: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createUserController = async(req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await createUser(data);
    res.status(200).json({ message: "User created successfully", payload: user });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateUserController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteUserController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await deleteUser(id);
    res.status(200).json({
      message: `User with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
  
};