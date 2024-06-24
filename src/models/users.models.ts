import { prisma } from "../utils/prisma"
import feelings from "../data/consts";


export interface getUserFilters {
  userType?: "venter" | "listener",
  country?: string,
  gender?: string,
  online?: boolean,
  topics?: string[]
}

export const getAllMoods = async() => {
  return feelings
};

export const getAllUsers = async(filters: getUserFilters) => {
  const users = await prisma.user.findMany({
    where: {
      ...(filters?.userType && {userType: filters.userType}),
      ...(filters?.country && {country: filters.country}),
      ...(filters?.gender && {gender: filters.gender}),
      ...(filters?.online && {online: filters.online}),
      ...(filters?.topics && {topics: {hasEvery: filters?.topics}})
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return users
};

export const getUserById = async(id: string) => {
  const user = await prisma.user.findFirst({
    where: {id}
  })
  return user
};

export const getUserByEmail = async(email: string) => {
  const user = await prisma.user.findFirst({
    where: {email}
  })
  return user
};

export const getUserByUsername = async(username: string) => {
  const user = await prisma.user.findFirst({
    where: {username}
  })
  return user
};

interface createUserData {
  firstName:       string
  lastName:        string
  userType:        "venter" | "listener"          
  username?:        string         
  country?:         string
  gender?:          string
  email:           string            
  password:        string    
  online?:          boolean           
  profileImage?:    string
  topics?:          string[]          
  feeling?:         object              
  bio?:             string
  emailVerified:   boolean  
}
export const createUser = async(userData: createUserData) => {
  const user = await prisma.user.create({
    data: userData
  })
  return user
};


interface updateUserData {
  firstName?:       string
  lastName?:        string
  userType?:        "venter" | "listener"          
  username?:        string         
  country?:         string
  gender?:          string
  email?:           string            
  password?:        string    
  online?:          boolean           
  profileImage?:    string
  topics?:          string[]          
  feeling?:         object              
  bio?:             string
}
export const updateUser = async (id: string, updateData: updateUserData) => {
  const user = await prisma.user.update({
    where: {id},
    data: updateData
  })
  return user;
};

export const updateUserByEmail = async (email: string, updateData: updateUserData) => {
  const user = await prisma.user.update({
    where: {email},
    data: updateData
  })
  return user;
};

export const deleteUser = async(id: string) => {
  const user = await prisma.user.delete({
    where: {id}
  })
  return user
};