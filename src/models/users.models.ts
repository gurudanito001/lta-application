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

export const getAllUsers = async(filters: getUserFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const users = await prisma.user.findMany({
    where: {
      ...(filters?.userType && {userType: filters.userType}),
      ...(filters?.country && {country: filters.country}),
      ...(filters?.gender && {gender: filters.gender}),
      ...(filters?.online && {online: filters.online}),
      ...(filters?.topics && {topics: {hasEvery: filters?.topics}})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.user.count({
    where: {
      ...(filters?.userType && {userType: filters.userType}),
      ...(filters?.country && {country: filters.country}),
      ...(filters?.gender && {gender: filters.gender}),
      ...(filters?.online && {online: filters.online}),
      ...(filters?.topics && {topics: {hasEvery: filters?.topics}})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: users}
  //return users
};

export interface getListenerPreferencesFilters {
  mood: string
  gender: string
  language: string
  country: string
}
export const getAllListeners = async( userId: string, filters: getListenerPreferencesFilters , pagination: {page: string, take: string}) => { 
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
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
    skip: skip,
    take: takeVal,
    include: {
      user: true
    }
  });
  const totalCount = await prisma.preference.count({
    where: {
      NOT: {
        userId: userId
      },
      ...(filters?.mood && {topics: { has: filters?.mood }}),
      ...(filters?.gender && {genders: { has: filters?.gender }}),
      ...(filters?.language && {languages: { has: filters?.language }}),
      ...(filters?.country && {countries: { has: filters?.country }})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: preferences}
};

export const getUserById = async(id: string) => {
  const user = await prisma.user.findFirst({
    where: {id},
    include: {
      preferences: true
    }
  })
  return user
};

export const getUserByEmail = async(email: string) => {
  const user = await prisma.user.findFirst({
    where: {email},
    include: {
      preferences: true
    }
  })
  return user
};

export const getUserByUsername = async(username: string) => {
  const user = await prisma.user.findFirst({
    where: {username},
    include: {
      preferences: true
    }
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

export const changePassword = async (id: string, newPassword: string) => {

  const user = await prisma.user.update({
    where: {id},
    data: {password: newPassword}
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

export interface followUserData {
  followerId:     string
  followingId:     string
}
export const followUser = async(userData: followUserData) => {
  const follow = await prisma.follows.create({
    data: userData
  })
  return follow
};

export const getAllFollowers = async(userId: string, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const followers = await prisma.follows.findMany({
    where: {followingId: userId},
    skip: skip,
    take: takeVal,
    include: {follower: true}
  })

  const totalCount = await prisma.follows.count({
    where: {followingId: userId},
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: followers}
}

export const getAllFollowing = async(userId: string, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const following = await prisma.follows.findMany({
    where: {followerId: userId},
    skip: skip,
    take: takeVal,
    include: {following: true}
  })

  const totalCount = await prisma.follows.count({
    where: {followerId: userId},
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: following}
}