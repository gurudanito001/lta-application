import { prisma } from "../utils/prisma"
import type { Email } from "@prisma/client"

interface getBlockedUsersFilters {
  blockerId: string,
}
export const getBlockedUsers = async(filters: getBlockedUsersFilters) => {
  const blockedUsers = await prisma.blocking.findMany({
    where: {
      ...(filters?.blockerId && {blockerId: filters.blockerId}),
    },
    include: {
      blocked: {
        select: {firstName: true, lastName: true, username: true}
      },
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return blockedUsers
};

interface blockingData {
  blockerId:       string
  blockedId:       string
}
export const blockUser = async(blockingData: blockingData) => {
  const blocking = await prisma.blocking.create({
    data: blockingData
  })
  return blocking
};


export const unBlockUser = async(id: string) => {
  const data = await prisma.blocking.delete({
    where: {id}
  })
  return data
};

export const unBlockUserByUsersId = async(unblockingData: blockingData) => {
  let blockData = await prisma.blocking.findFirst({
    where: {
      blockerId: unblockingData.blockerId,
      blockedId: unblockingData.blockedId
    }
  })
  const data = await prisma.blocking.delete({
    where: {id: blockData?.id}
  })
  return data
};

export const checkForBlocking = async(blockingData: blockingData) => {
  let blockData = await prisma.blocking.findFirst({
    where: {
      blockerId: blockingData.blockerId,
      blockedId: blockingData.blockedId
    }
  })
  
  return blockData ? true : false
};