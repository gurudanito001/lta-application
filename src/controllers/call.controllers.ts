import { Request, Response } from 'express';
import { getAllCalls, getCallStats, getCallById, createCall, updateCall, clearCallLogs } from '../models/calls.models';
import { getUserById } from '../models/users.models';
import { createNotification } from '../models/notification.models';


export const getCallsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.query?.userId || req?.user?.userId, order: req?.query?.order, status: req?.query?.status}
  try {
    const calls = await getAllCalls(filters, {page, take});
    res.status(200).json({ message: "Calls fetched successfully", payload: calls });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getCallStatsController =  async (req: Request | any, res: Response) => {
  const userId = req?.params?.userId || req?.user?.userId
  try {
    const callStats = await getCallStats(userId);
    res.status(200).json({ message: "Call Stats fetched successfully", payload: callStats });
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
  appid: string,
  call_id: string
  caller:       string
  user_ids:    string[]
  timestamp: number
  duration?:       number,
  event: string,
  timeout?: number
}
export const saveCallController = async(req: Request, res: Response) => {
  try {
    const data = req.body as saveCallData;
    console.log("CREATE CALL!!!!", data)
    const call = await createCall(data);
    res.status(200).json({ message: "Call created successfully", payload: call });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

interface updateCallData {
  appid?: string,
  call_id: string
  event: string,
  reason?:  string,
  timestamp?: number
  user_ids?: string[]
  duration?: number,
  payload: any
}
export const updateCallController = async(req: Request, res: Response) => {
  try {
    const data = req.body as updateCallData | any;
    const parsedData = JSON.parse(data);
    console.log("UPDATE CALL Data!!!!", parsedData)
    const parsedPayload = JSON.parse(parsedData?.payload);
    console.log("parsed payload!!!", parsedPayload)
    const parsedPayloadData = JSON.parse(parsedPayload?.data);
    console.log("parsed payload data!!!", parsedData)
    const call = await updateCall(data);

    const caller = await getUserById(call?.callerId);
    const callee = await getUserById(call?.calleeId);
    if(req.body?.event === "call_cancel"){
      await createNotification({userId: call?.callerId, type: "call", content: `You just cancelled your call with ${callee?.firstName} ${callee?.lastName}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `${caller?.firstName} ${caller?.lastName} just cancelled a call with you`}) //notify the callee
    }
    if(req.body?.event === "call_timeout"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call was missed by ${callee?.firstName} ${callee?.lastName}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `You missed a call from ${caller?.firstName} ${caller?.lastName}`}) //notify the callee
    }

    if(req.body?.event === "call_reject"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call was rejected by ${callee?.firstName} ${callee?.lastName}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `You rejected a call from ${caller?.firstName} ${caller?.lastName}`}) //notify the callee
    }

    if(req.body?.event === "call_end"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call with ${callee?.firstName} ${callee?.lastName} lasted for ${call?.duration} seconds`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `Your call with ${caller?.firstName} ${caller?.lastName} lasted for ${call?.duration} seconds`}) //notify the callee
    }
    
    res.status(200).json({ message: "Call updated successfully", payload: call });
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