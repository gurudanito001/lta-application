import { prisma } from "../utils/prisma"
import type { Recommendation } from "@prisma/client"


export const getAllRecommendations = async() => {
  const recommendations = await prisma.recommendation.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return recommendations
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