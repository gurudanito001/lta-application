import { Request, Response } from 'express';
import { getAllCalls, getCallById, createCall, clearCallLogs } from '../models/calls.models';
import type { Call } from '@prisma/client';
import { uploadImage } from '../services/fileService';


export const getCallsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.user?.userId, order: req?.query?.order, status: req?.query?.status}
  try {
    const calls = await getAllCalls(filters, {page, take});
    res.status(200).json({ message: "Calls fetched successfully", payload: calls });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getCallByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const call = await getCallById(id);
    if (call) {
      res.status(200).json({ message: "Call fetched successfully", payload: call });
    } else {
      res.status(404).json({ message: 'Call not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

interface saveCallData {
  callerId: string, 
  receiverId: string,
  duration: number,
}
export const saveCallController = async(req: Request, res: Response) => {
  try {
    const data = req.body as saveCallData;
    const call = await createCall(data);
    res.status(200).json({ message: "Call created successfully", payload: call });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const clearCallLogsController = async(req: Request | any, res: Response) => {
  try {
    const userId = req.user.userId;
    const result = await clearCallLogs(userId);
    res.status(200).json({ message: "Call updated successfully", payload: result });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};