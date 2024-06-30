import { prisma } from "../utils/prisma"
import feelings from "../data/consts";
import languages from "../data/languages";


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

export const getAllLanguages = async() => {
  return languages
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

export interface getListenerPreferencesFilters {
  mood: string
  gender: string
  language: string
  country: string
}
export const getAllListeners = async( userId: string, filters: getListenerPreferencesFilters) => { 
  console.log(filters)
  const preferences = await prisma.preference.findMany({
    where: {
      NOT: {
        userId: userId
      },
      ...(filters?.mood && {topics: { has: filters?.mood }}),
      ...(filters?.gender && {genders: { has: filters?.gender }}),
      ...(filters?.language && {languages: { has: filters?.language }}),
      ...(filters?.country && {countries: { has: filters?.country }})
    },
    include: {
      user: true
    }
  });
  return preferences
};

export const getUserById = async(id: string) => {
  const user = await prisma.user.findFirst({
    where: {id},
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
  language?:         string          
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

interface CreateUserListeningPreferencesData {
  userId:           string
  genders?:         string[]
  languages?:       string[]          
  topics?:          string[] 
  countries?:       string[]
}
export const createUserListeningPreferences = async(preferences: CreateUserListeningPreferencesData) => {
  const listeningPreferences = await prisma.preference.create({
    data: preferences
  })
  return listeningPreferences
};

interface UpdateUserListeningPreferencesData {
  genders?:        string[]
  languages?:      string[]          
  topics?:         string[]    
  countries?:      string[]
}
export const updateUserListeningPreferences = async( userId: string, preferences: UpdateUserListeningPreferencesData) => {
  const listeningPreferences = await prisma.preference.update({
    where: {userId},
    data: preferences
  })
  return listeningPreferences
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
  language?:        string        
  feeling?:         object              
  bio?:             string
}
export const updateUser = async (id: string, updateData: updateUserData) => {
  delete updateData?.email
  delete updateData?.password
  delete updateData?.userType
  delete updateData?.profileImage

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