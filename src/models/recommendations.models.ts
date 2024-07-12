import { prisma } from "../utils/prisma"
import type { Recommendation } from "@prisma/client"


export const getAllRecommendations = async(pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const recommendations = await prisma.recommendation.findMany({
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.recommendation.count();
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: recommendations}
};

export const getRecommendationById = async(id: string) => {
  const recommendation = await prisma.recommendation.findFirst({
    where: {id}
  })
  return recommendation
};

interface createRecommendationData {
  title:                   string
  description?:             string
  image?:                   string
  link?:                    string
}
export const createRecommendation = async(recommendationData: createRecommendationData) => {
  const recommendation = await prisma.recommendation.create({
    data: recommendationData
  })
  return recommendation
};


interface updateRecommendationData {
  title?:                   string
  description?:             string
  image?:                   string
  link?:                    string
}
export const updateRecommendation = async (id: string, updateData: updateRecommendationData) => {
  const recommendation = await prisma.recommendation.update({
    where: {id},
    data: updateData
  })
  return recommendation;
};

export const deleteRecommendation = async(id: string) => {
  const recommendation = await prisma.recommendation.delete({
    where: {id}
  })
  return recommendation
};