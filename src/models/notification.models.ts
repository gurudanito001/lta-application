import { prisma } from "../utils/prisma"
import type { Notification } from "@prisma/client"

type filtersData = {
  userId?: string,
  type?:   "call" | "follow"
  isRead?: boolean
}
export const getAllNotifications = async(filters: filtersData, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const notifications = await prisma.notification.findMany({
    where: {
      ...( filters.userId && {userId: filters?.userId}),
      ...( filters.type && {type: filters?.type}),
      isRead: filters?.isRead || false
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.notification.count({
    where: {
      ...( filters.userId && {userId: filters?.userId}),
      ...( filters.type && {type: filters?.type}),
      isRead: filters?.isRead || false
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: notifications}
};

export const getNotificationById = async(id: string) => {
  const notification = await prisma.notification.findFirst({
    where: {id}
  })
  return notification
};

interface createNotificationData {
  userId?:                   string
  type:                      "call" | "follow" 
  content:                   string
  isRead?:                   boolean
}
export const createNotification = async(notificationData: createNotificationData) => {
  const notification = await prisma.notification.create({
    data: notificationData
  })
  return notification
};


interface updateRecommendationData {
  isRead:                   boolean
}
export const updateNotification = async (id: string, updateData: updateRecommendationData) => {
  const notification = await prisma.notification.update({
    where: {id},
    data: updateData
  })
  return notification;
};

export const deleteNotification = async(id: string) => {
  const notification = await prisma.notification.delete({
    where: {id}
  })
  return notification
};