import { Request, Response } from 'express';
import { getAllReports, createReport } from '../models/report.models';


export const getReportsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {
    reporterId: req?.query?.reporterId || "",
    offenderId: req?.query?.offenderId || "",
  }
  try {
    const reports = await getAllReports(filters, {page, take});
    res.status(200).json({ message: "Reports fetched successfully", payload: reports });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createReportController = async(req: Request, res: Response) => {
  try {
    const reportData = req.body as {reporterId: string, offenderId: string, reason: string};
    const result = await createReport(reportData);
    if (result) {
      res.status(200).json({ message: "Report created successfully", payload: result });
    } else {
      res.status(400).json({ message: 'Error creating rating' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};
