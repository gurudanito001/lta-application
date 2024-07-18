import { duration } from "moment";
import { prisma } from "../utils/prisma"
import type { Call } from "@prisma/client"

interface getCallsFilters {
  userId: string,
  order?: string,
  status?: string //"missed" | "answered" | "10mins or less" | "30mins or less" | "more than 30mins"
}


export const getAllCalls = async(filters: getCallsFilters,  pagination: {page: string, take: string}) => {

  function deriveDurationFilter (status?: string ){
    switch(status){
      case "missed":
        return {equals: 0}
      case "answered":
        return {gt: 0}
      case "10mins_or_less":
        return {lte: 600}
      case "30mins_or_less":
        return {lte: 600}
      case "more_than_30mins":
        return {gt: 600}
      default: 
        return {gte: 0}
    }
  }  

  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)

  const calls = await prisma.call.findMany({
    where: {
      OR: [
        {callerId: filters?.userId},
        {receiverId: filters?.userId}
      ],
      duration: { 
        ...(deriveDurationFilter(filters?.status))
      }
    },
    skip: skip,
    take: takeVal,
    include: {
      initiatedBy: {
        select: {firstName: true, lastName: true, username: true}
      },
      receivedBy: {
        select: {firstName: true, lastName: true, username: true}
      }
    },
    orderBy: {
      createdAt: filters?.order === "asc" ? filters?.order : "desc"
    }
  });

  const totalCount = await prisma.call.count({
    where: {
      OR: [
        {callerId: filters?.userId},
        {receiverId: filters?.userId}
      ],
      duration: { 
        ...(deriveDurationFilter(filters?.status))
      }
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: calls}
};

export const getCallById = async(id: string) => {
  const call = await prisma.call.findFirst({
    where: {id},
    include: {
      initiatedBy: {
        select: {firstName: true, lastName: true, username: true}
      },
      receivedBy: {
        select: {firstName: true, lastName: true, username: true}
      }
    },
  })
  return call
};

interface createCallData {
  callerId:       string
  receiverId:    string
  duration:       number
}
export const createCall = async(callData: createCallData) => {
  const call = await prisma.call.create({
    data: {
      callerId: callData?.callerId,
      receiverId: callData?.receiverId,
      initiatedById: callData?.callerId,
      receivedById: callData?.receiverId,
      duration: callData?.duration
    }
  })
  return call
};


interface updateCallData {
  callerId:       string
  receiverId:    string
}
export const updateCall = async (id: string, updateData: updateCallData) => {
  const call = await prisma.call.update({
    where: {id},
    data: updateData
  })
  return call;
};

export const clearCallLogs = async(userId: string) => {
  const callerData = await prisma.call.updateMany({
    where: {callerId: userId},
    data: {callerId: null}
  })
  const receiverData = await prisma.call.updateMany({
    where: {receiverId: userId},
    data: {receiverId: null}
  })
  return {callerData, receiverData}
};

export const deleteCall = async(id: string) => {
  const data = await prisma.call.delete({
    where: {id}
  })
  return data
};