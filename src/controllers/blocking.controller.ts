import { Request, Response } from 'express';
import { getBlockedUsers, blockUser, unBlockUser, unBlockUserByUsersId, checkForBlocking } from '../models/blocking.models';
import type { Blocking } from '@prisma/client';


export const getBlockedUsersController =  async (req: Request | any, res: Response) => {
  /* const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20";  */
  let filters = {blockerId: req?.user?.userId}
  try {
    const blockedUsers = await getBlockedUsers(filters);
    res.status(200).json({ message: "Blocked Users fetched successfully", payload: blockedUsers });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const blockUserController = async(req: Request, res: Response) => {
  try {
    const blockingData = req.body as {blockerId: string, blockedId: string};
    const result = await blockUser(blockingData);
    if (result) {
      res.status(200).json({ message: "Blocking was successfully", payload: result });
    } else {
      res.status(404).json({ message: 'Could not block user' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const unBlockUserController = async(req: Request, res: Response) => {
  try {
    const blockingData = req.body as {blockerId: string, blockedId: string};
    const result = await unBlockUserByUsersId(blockingData);
    if (result) {
      res.status(200).json({ message: "unBlocking was successfully", payload: result });
    } else {
      res.status(404).json({ message: 'Could not unblock user' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const checkForBlockingController = async(req: Request, res: Response) => {
  try {
    const blockingData = req.body as {blockerId: string, blockedId: string};
    const result = await checkForBlocking(blockingData);
    
    res.status(200).json({ message: `user is ${result ? "blocked" : "not blocked"}`, payload: result });
    
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};
