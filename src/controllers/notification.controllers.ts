import { Request, Response } from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} from '../models/notification.models';
import type { Notification } from '@prisma/client';


export const getNotificationsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {
    userId: req?.query?.userId || req?.user?.userId || "",
    type:   req?.query?.type,
    isRead: req?.query?.isRead || false
  }
  try {
    const notifications = await getAllNotifications( filters, {page, take});
    res.status(200).json({ message: "Notifications fetched successfully", payload: notifications });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getNotificationByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const notification = await getNotificationById(id);
    if (notification) {
      res.status(200).json({ message: "Notification fetched successfully", payload: notification });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

interface createNotificationData {
  userId: string,
  type:   "call" | "follow"
  content: string
}
export const createNotificationController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createNotificationData;
    const notification = await createNotification(data);
    res.status(200).json({ message: "Notification created successfully", payload: notification });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateNotificationController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const updatedNotification = await updateNotification(id, updateData);
    res.status(200).json({ message: "Notification updated successfully", payload: updatedNotification });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteNotificationController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const notification = await deleteNotification(id);
    res.status(200).json({
      message: `Notification with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};