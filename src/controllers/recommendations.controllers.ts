import { Request, Response } from 'express';
import {
  getAllRecommendations,
  getRecommendationById,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation
} from '../models/recommendations.models';
import type { Recommendation } from '@prisma/client';
import { uploadImage } from '../services/fileService';


export const getRecommendationsController =  async (req: Request, res: Response) => {
  try {
    const recommendations = await getAllRecommendations();
    res.status(200).json({ message: "Recommendations fetched successfully", payload: recommendations });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getRecommendationByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const recommendation = await getRecommendationById(id);
    if (recommendation) {
      res.status(200).json({ message: "Recommendation fetched successfully", payload: recommendation });
    } else {
      res.status(404).json({ message: 'Recommendation not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

interface createRecommendationData {
  title: string, 
  description: string,
  image: string,
  link: string
}
export const createRecommendationController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createRecommendationData;
    let result = null;
    if(data?.image){
      result = await uploadImage({data: data?.image})
      data.image = result?.url;
    }
    const recommendation = await createRecommendation(data);
    res.status(200).json({ message: "Recommendation created successfully", payload: recommendation });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateRecommendationController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const updatedRecommendation = await updateRecommendation(id, updateData);
    res.status(200).json({ message: "Recommendation updated successfully", payload: updatedRecommendation });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteRecommendationController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const recommendation = await deleteRecommendation(id);
    res.status(200).json({
      message: `Recommendation with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
  
};