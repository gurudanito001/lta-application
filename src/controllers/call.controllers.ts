import { Request, Response } from 'express';
import { getAllCalls, getAllCallsBetweenTwoUsers, getCallStats, getCallById, createCall, updateCall, clearCallLogs, setCallTime } from '../models/calls.models';
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

export const getCallsBetweenTwoUsersController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {user1: req?.params?.user1, user2: req?.params?.user2, order: req?.query?.order, status: req?.query?.status}
  try {
    const calls = await getAllCallsBetweenTwoUsers(filters, {page, take});
    res.status(200).json({ message: "Calls between two users fetched successfully", payload: calls });
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
  room_id: string,
  caller:       string
  user_ids:    string[]
  timestamp: number
  duration?:       number,
  event: string,
  timeout?: number,
  payload: any
}
export const saveCallController = async(req: Request, res: Response) => {
  try {
    let data = req.body as saveCallData;

    console.log("CREATE CALL!!!!", data)
    const payload = JSON.parse(data?.payload);
    console.log("Payload!!!!", payload)
    const payloadData = JSON.parse(payload?.data)
    console.log("Payload Data!!!!", payloadData)


    data.room_id = payloadData?.call_id;
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
}
export const updateCallController = async(req: Request, res: Response) => {
  try {
    const data = req.body as updateCallData;
    console.log("UPDATE CALL!!!!", data)
    const call = await updateCall(data);

    const caller = await getUserById(call?.callerId);
    const callee = await getUserById(call?.calleeId);
    if(req.body?.event === "call_cancel"){
      await createNotification({userId: call?.callerId, type: "call", content: `You just cancelled your call with ${callee?.username}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `${caller?.username} just cancelled a call with you`}) //notify the callee
    }
    if(req.body?.event === "call_timeout"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call was missed by ${callee?.username}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `You missed a call from ${caller?.username}`}) //notify the callee
    }

    if(req.body?.event === "call_reject"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call was rejected by ${callee?.username}`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `You rejected a call from ${caller?.username}`}) //notify the callee
    }
    
    res.status(200).json({ message: "Call updated successfully", payload: call });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};


interface setCallTimeData {
  room_id: string,
  login_time: any
  logout_time: any,
  event: "room_login" | "room_logout",
  duration?: number
}
export const setCallTimeController = async(req: Request, res: Response) => {
  try {
    const data = req.body as setCallTimeData;
    console.log("SET CALL TIME!!!!", data)

    let duration = 0
    if(data?.event === "room_logout"){
      let startTime = parseInt(data.login_time);
      let endTime = parseInt(data.logout_time);
      let durationMilli = endTime - startTime;
      duration = Math.ceil(durationMilli / 1000);
    }
    data.duration = duration;
    data.login_time = data?.login_time ? data.login_time.toString() : "";
    data.logout_time = data?.logout_time ? data.logout_time.toString() : ""
    const call = await setCallTime(data);

    const caller = await getUserById(call?.callerId);
    const callee = await getUserById(call?.calleeId);
    if(data?.event === "room_logout"){
      await createNotification({userId: call?.callerId, type: "call", content: `Your call with ${callee?.username} lasted for ${call?.duration} seconds`}) //notify the caller
      await createNotification({userId: call?.calleeId, type: "call", content: `Your call with ${caller?.username} lasted for ${call?.duration} seconds`}) //notify the callee
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