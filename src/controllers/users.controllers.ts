import { Request, Response } from 'express';
import {
  getAllMoods,
  getAllLanguages,
  getAllUsers,
  getAllListeners,
  getUserById,
  createUser,
  updateUser,
  disableUser,
  enableUser,
  createUserListeningPreferences,
  updateUserListeningPreferences,
  deleteUser,
  getUserByUsername,
  getListenerPreferencesFilters,
  changePassword,
  followUser,
  unFollowUser,
  getAllFollowers,
  getAllFollowing,
  checkIfIFollowUser,
  checkIfUserFollowsMe
} from '../models/users.models';
import { createNotification } from '../models/notification.models';
import { getBlockedUsers } from '../models/blocking.models';
import type { User } from '@prisma/client';
import { getUserFilters } from '../models/users.models';
import { uploadImage } from '../services/fileService';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../services/authServices';


export const getMoodsController =  async (req: Request, res: Response) => {
  try {
    /* await prisma.email.deleteMany();
    await prisma.user.deleteMany();
    await prisma.listeningPreferences.deleteMany();
    await prisma.recommendation.deleteMany(); */

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

export const getLanguagesController =  async (req: Request, res: Response) => {
  try {
    const languages = await getAllLanguages();
    res.status(200).json({ message: "Languages fetched successfully", payload: languages });
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

export const getUsersController =  async (req: Request | any, res: Response) => {
  const {userType, country, gender, online, topics}: getUserFilters = req.query;
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  const id = req.user.userId;

  try {
    const users = await getAllUsers(id, {userType, country, gender, online, topics}, {page, take});
    res.status(200).json({ message: "Users fetched successfully", payload: users });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getListenersController =  async (req: Request | any, res: Response) => {
  const id = req.user.userId;
  const {mood, gender, language, country}: getListenerPreferencesFilters = req.query;
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  try {
    const listeners = await getAllListeners(id, {mood, gender, language, country}, {page, take});
    res.status(200).json({ message: "Listeners fetched successfully", payload: listeners });
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

export const updateUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    let updateData = req.body;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const disableUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await disableUser(id);
    res.status(200).json({ message: "User disabled successfully", payload: null });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const enableUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await enableUser(id);
    res.status(200).json({ message: "User enabled successfully", payload: user });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createListeningPreferencesController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    let user = await getUserById(id);
    if(user?.userType !== "listener"){
      return res.status(400).json({ message: `Only listeners can have listening preferences` });
    }
    const data = req.body;
    data.userId = id;
    const listeningPreferences = await createUserListeningPreferences(data);
    res.status(200).json({ message: "User Listening Preferences updated successfully", payload: listeningPreferences });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateListeningPreferencesController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    let user = await getUserById(id);
    if(user?.userType !== "listener"){
      return res.status(400).json({ message: `Only listeners can update listening preferences` });
    }
    const updateData = req.body;
    const listeningPreferences = await updateUserListeningPreferences(id, updateData)
    res.status(200).json({ message: "User Listening Preferences updated successfully", payload: listeningPreferences });
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

export const changePasswordController =  async (req: Request | any, res: Response) => {
  const id = req.user.userId;
  try {
    const {newPassword} = req.body;
    
    if (newPassword?.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }else {
      const hashedPassword = await hashPassword(newPassword);
      await changePassword(id, hashedPassword);
    }
    res.status(200).json({ message: "password changed successful", status: "success" })
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const followUserController = async(req: Request, res: Response) => {
  try {
    const data = req.body as {followerId: string, followingId: string};
    const followData = await followUser(data);
    const follower = await getUserById(data?.followerId);
    const followed = await getUserById(data?.followingId);
    await createNotification({userId: data?.followerId, type: "follow", content: `You just followed ${followed?.firstName} ${followed?.lastName}`}) //notify the person that followed
    await createNotification({userId: data?.followingId, type: "follow", content: `${follower?.firstName} ${follower?.lastName} just followed you`}) //notify the person that was followed 
    res.status(200).json({ message: "User followed successfully", payload: followData });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const unFollowUserController = async(req: Request, res: Response) => {
  try {
    const data = req.body;
    const unFollowData = await unFollowUser(data);
    res.status(200).json({ message: "User unFollowed successfully", payload: unFollowData });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getFollowersController =  async (req: Request | any, res: Response) => {
  const userId = req?.query?.userId;
  const id = userId || req.user.userId;
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  try {
    const followers = await getAllFollowers(id, {page, take});
    res.status(200).json({ message: "Followers fetched successfully", payload: followers });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getFollowingController =  async (req: Request | any, res: Response) => {
  const userId = req?.query?.userId;
  const id = userId || req.user.userId;
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  try {
    const following = await getAllFollowing(id, {page, take});
    res.status(200).json({ message: "Following fetched successfully", payload: following });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const checkIfIFollowUserController = async(req: Request, res: Response) => {
  try {
    const {followerId, followingId} = req.body;
    const result = await checkIfIFollowUser({followerId, followingId});
    
    res.status(200).json({ message: `You are ${result ? "following user" : "not following user"}`, payload: result });
    
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const checkIfUserFollowsMeController = async(req: Request, res: Response) => {
  try {
    const {followerId, followingId} = req.body;
    const result = await checkIfUserFollowsMe({followerId, followingId});
    
    res.status(200).json({ message: `You are ${result ? "followed by user" : "not followed by user"}`, payload: result });
    
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

