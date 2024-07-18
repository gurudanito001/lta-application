import { Request, Response } from 'express';
import { createRating, getAllRatings, calculateMeanUserRating } from '../models/rating.models';
import type { Blocking } from '@prisma/client';


export const getRatingsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {
    raterId: req.body.raterId || "",
    ratedId: req.body.ratedId || "",
    ratingCategory: req.body.ratingCategory || ""
  }
  try {
    const ratings = await getAllRatings(filters, {page, take});
    res.status(200).json({ message: "Ratings fetched successfully", payload: ratings });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createRatingController = async(req: Request, res: Response) => {
  try {
    const ratingData = req.body as {raterId: string, ratedId: string, rating: number, comment: string};
    const result = await createRating(ratingData);
    if (result) {
      res.status(200).json({ message: "Rating created successfully", payload: result });
    } else {
      res.status(400).json({ message: 'Error creating rating' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const calculateMeanRatingController = async(req: Request | any, res: Response) => {
  try {
    const userId = req?.user?.userId
    const result = await calculateMeanUserRating(userId);
    if (result) {
      res.status(200).json({ message: "Rating fetched successfully", payload: result });
    } else {
      res.status(400).json({ message: 'Error getting rating' });
    }
    
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};
