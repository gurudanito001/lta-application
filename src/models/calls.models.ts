import { duration } from "moment";
import { prisma } from "../utils/prisma"
import type { Call } from "@prisma/client";
import formatIdToUuid from "../services/formatIdToUUID";

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
        {calleeId: filters?.userId}
      ],
      /* duration: { 
        ...(deriveDurationFilter(filters?.status))
      } */
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
        {calleeId: filters?.userId}
      ],
      /* duration: { 
        ...(deriveDurationFilter(filters?.status))
      } */
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: calls}
};

export const getCallStats = async(userId: string) => {
  const numOfCalls = await prisma.call.count({
    where: {
      OR: [
        {callerId: userId},
        {calleeId: userId}
      ],
      duration: {
        gt: 0
      }
    }
  })
  const durationOfCalls = await prisma.call.aggregate({
    where: {
      OR: [
        {callerId: userId},
        {calleeId: userId}
      ],
      duration: {
        gt: 0
      }
    },
    _sum: {
      duration: true,
    },
  });
  return {numOfCalls, durationOfCalls: durationOfCalls._sum.duration || 0, averageduration: durationOfCalls?._sum?.duration ? Math.ceil(durationOfCalls?._sum?.duration / numOfCalls) : 0}
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
  appid: string,
  call_id: string
  room_id: string
  caller:       string
  user_ids:    string[]
  timestamp: number
  duration?:       number,
  event: string,
  timeout?: number
}
export const createCall = async(callData: createCallData) => {
  const call = await prisma.call.create({
    data: {
      appId: callData?.appid,
      callId: callData?.call_id,
      roomId: callData?.room_id,
      callerId: formatIdToUuid(callData?.caller),
      calleeId: formatIdToUuid(callData?.user_ids[0]),
      initiatedById: formatIdToUuid(callData?.caller),
      receivedById: formatIdToUuid(callData?.user_ids[0]),
      createTime: callData?.timestamp,
      status: callData?.event,
      timeout: callData?.timeout,
    }
  })
  return call
};


interface updateCallData {
  appid?: string,
  call_id: string
  event: string,
  reason?:  string,
  timestamp?: number
  user_ids?:    string[]
  duration?:       number,
}
export const updateCall = async (updateData: updateCallData) => {
  const call = await prisma.call.update({
    where: {callId: updateData?.call_id},
    data: {
      status: updateData?.event,
      ...(updateData?.reason && {reason: updateData?.reason}),
      ...(updateData?.duration && {duration: updateData?.duration}),
      ...(updateData?.event === "call_cancel" && {cancelTime: updateData?.timestamp}),
      ...(updateData?.event === "call_timeout" && {timeoutTime: updateData?.timestamp}),
      ...(updateData?.event === "call_accept" && {acceptTime: updateData?.timestamp}),
      ...(updateData?.event === "call_reject" && {rejectTime: updateData?.timestamp}),
      //...(updateData?.event === "call_end" && {endTime: updateData?.timestamp}),
    }
  })
  return call;
};

interface setCallTimeData {
  room_id: string,
  login_time: string
  logout_time: string,
  event: "room_login" | "room_logout",
  duration?: number
}
export const setCallTime = async (callTimeData: setCallTimeData) => {
  
  const updatedCall = await prisma.call.update({
    where: {roomId: callTimeData?.room_id},
    data: {
      ...(callTimeData?.login_time && {loginTime: callTimeData?.login_time}),
      ...(callTimeData?.logout_time && {logoutTime: callTimeData?.logout_time}),
      ...(callTimeData?.duration && {duration: callTimeData?.duration})
    }
  })
  return updatedCall;
};

export const clearCallLogs = async(userId: string) => {
  const callerData = await prisma.call.updateMany({
    where: {callerId: userId},
    data: {callerId: ""}
  })
  const receiverData = await prisma.call.updateMany({
    where: {calleeId: userId},
    data: {calleeId: ""}
  })
  return {callerData, receiverData}
};

export const deleteCall = async(id: string) => {
  const data = await prisma.call.delete({
    where: {id}
  })
  return data
};