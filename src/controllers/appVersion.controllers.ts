import { Request, Response } from 'express';
import {
  getAllAppVersions,
  getAppVersionById,
  createAppVersion,
  updateAppVersion,
  deleteAppVersion
} from '../models/appVersion.model';


export const getAppVersionsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  
  try {
    const appVersions = await getAllAppVersions({page, take});
    res.status(200).json({ message: "AppVersions fetched successfully", payload: appVersions });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getAppVersionByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const appVersion = await getAppVersionById(id);
    if (appVersion) {
      res.status(200).json({ message: "AppVersion fetched successfully", payload: appVersion });
    } else {
      res.status(404).json({ message: 'AppVersion not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

interface createAppVersionData {
  version:                  string
  message:                  string
  force?:                    boolean
}
export const createAppVersionController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createAppVersionData;
    const appVersion = await createAppVersion(data);
    res.status(200).json({ message: "AppVersion created successfully", payload: appVersion });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};


interface updataAppVersionData {
  version?:                  string
  message?:                  string
  force?:                    boolean
}
export const updateAppVersionController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updataAppVersionData;
    const updatedAppVersion = await updateAppVersion(id, updateData);
    res.status(200).json({ message: "AppVersion updated successfully", payload: updatedAppVersion });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteAppVersionController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const appVersion = await deleteAppVersion(id);
    res.status(200).json({
      message: `AppVersion with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};