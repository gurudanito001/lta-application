import { prisma } from "../utils/prisma"
import feelings from "../data/consts";
import languages from "../data/languages";
import { getBlockedUsers } from "./blocking.models";
import { calculateMeanUserRating } from "./rating.models";


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

export const getAllUsers = async(userId: string, filters: getUserFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const users = await prisma.user.findMany({
    where: {
      NOT:{
        id: userId
      },
      blocked:{
        none:{
          blockerId: userId
        }
      },
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
      NOT:{
        id: userId
      },
      blocked:{
        none:{
          blockerId: userId
        }
      },
      ...(filters?.userType && {userType: filters.userType}),
      ...(filters?.country && {country: filters.country}),
      ...(filters?.gender && {gender: filters.gender}),
      ...(filters?.online && {online: filters.online}),
      ...(filters?.topics && {topics: {hasEvery: filters?.topics}})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: users}
};

export interface getListenerFilters {
  mood: string
  gender: string
  language: string
  country: string,
  rating: number
}
export const getAllListeners = async( userId: string, filters: getListenerFilters , pagination: {page: string, take: string}) => { 
  const skip = ((parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const listeners = await prisma.user.findMany({
    where: {
      userType: "listener",
      NOT:{
        id: userId
      },
      blocked:{
        none:{
          blockerId: userId
        }
      },
      ...( filters?.mood && {
        OR: [
          {topics: {has: filters.mood}},
          {topics: {has: "all"}}
        ]
      }),
      ...( filters?.gender && {gender: filters.gender}),
      ...( filters?.language && {language: {has: filters?.language}}),
      ...( filters?.country && {country: filters.country}),
      ...( filters?.rating && {averageRating: {gte: filters.rating}})
    },
    skip: skip,
    take: takeVal
  });
  const totalCount = await prisma.user.count({
    where: {
      userType: "listener",
      NOT:{
        id: userId
      },
      blocked:{
        none:{
          blockerId: userId
        }
      },
      ...( filters?.mood && {topics: {has: filters.mood}}),
      ...( filters?.gender && {gender: filters.gender}),
      ...( filters?.language && {language: {has: filters?.language}}),
      ...( filters?.country && {country: filters.country}),
      ...( filters?.rating && {averageRating: {gte: filters.rating}})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: listeners}
};

export const getUserById = async(id: string) => {
  const user = await prisma.user.findFirst({
    where: {id},
  })
  return user
};

export const getUserByEmail = async(email: string) => {
  const user = await prisma.user.findFirst({
    where: {email},
  })
  return user
};

export const getUserByUsername = async(username: string) => {
  const user = await prisma.user.findFirst({
    where: {username},
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
  language?:        string[]          
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
  isActive?:        boolean      
  country?:         string
  gender?:          string
  email?:           string            
  password?:        string    
  online?:          boolean           
  profileImage?:    string
  topics?:          string[]  
  language?:        string[]        
  feeling?:         object              
  bio?:             string
  averageRating?:   number
}
export const updateUser = async (id: string, updateData: updateUserData) => {
  delete updateData?.email
  delete updateData?.password
  delete updateData?.userType
  delete updateData?.isActive


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

export const disableUser = async(id: string) => {
  const user = await prisma.user.update({
    where: {id},
    data: {isActive: false}
  })
  return user
};

export const enableUser = async(id: string) => {
  const user = await prisma.user.update({
    where: {id},
    data: {isActive: true}
  })
  return user
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

export const unFollowUser = async(userData: followUserData) => {
  const followData = await prisma.follows.findFirst({
    where: {
      followerId: userData?.followerId,
      followingId: userData?.followingId
    }
  })
  let result = await prisma.follows.delete({
    where: {id: followData?.id}
  })
  return result
};

export const getAllFollowers = async(userId: string, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const followers = await prisma.follows.findMany({
    where: {
      follower: {
        blocked:{
          none:{
            blockerId: userId
          }
        }
      },
      followingId: userId
    },
    skip: skip,
    take: takeVal,
    include: {
      follower:{
        include:{
          following: {
            where: {
              followerId: userId
            },
            select: {followerId: true}
          }
        }
      }
    }
  })

  const totalCount = await prisma.follows.count({
    where: {
      follower: {
        blocked:{
          none:{
            blockerId: userId
          }
        }
      },
      followingId: userId
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: followers}
}

export const getAllFollowing = async(userId: string, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const following = await prisma.follows.findMany({
    where: {
      following: {
        blocked:{
          none:{
            blockerId: userId
          }
        }
      },
      followerId: userId
    },
    skip: skip,
    take: takeVal,
    include: {
      following:{
        include:{
          followers: {
            where: {
              followingId: userId
            },
            select: {followingId: true}
          }
        }
      }
    }
  })

  const totalCount = await prisma.follows.count({
    where: {
      following: {
        blocked:{
          none:{
            blockerId: userId
          }
        }
      },
      followerId: userId
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: following}
}

export const checkIfIFollowUser = async(checkData: {followerId: string, followingId: string}) => {
  
  const checkResult = await prisma.follows.findFirst({
    where: {followerId: checkData?.followerId, followingId: checkData?.followingId},
  })
  return checkResult ? true : false
}

export const checkIfUserFollowsMe = async(checkData: {followerId: string, followingId: string}) => {
  
  const checkResult = await prisma.follows.findFirst({
    where: {followerId: checkData?.followerId, followingId: checkData?.followingId},
  })
  return checkResult ? true : false
}