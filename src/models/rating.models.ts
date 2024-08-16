import { prisma } from "../utils/prisma"
import type { Email } from "@prisma/client";
import { updateUser } from "./users.models";

interface getRatingFilters {
  raterId: string
  ratedId: string,
  ratingCategory:  "5star_or_less" | "4star_or_less" | "3star_or_less" | "2star_or_less"
}

export const getAllRatings = async(filters: getRatingFilters, pagination: {page: string, take: string}) => {
  function deriveRatingFilter (status: string){
    switch(status){
      case "5star_or_less":
        return {lte: 5}
      case "4star_or_less":
        return {lte: 4}
      case "3star_or_less":
        return {lte: 3}
      case "2star_or_less":
        return {lte: 2}
      default: 
        return {lte: 5}
    }
  } 

  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const ratings = await prisma.rating.findMany({
    where: {
      OR: [
        {raterId: filters?.raterId},
        {ratedId: filters?.ratedId}
      ],
      rating: {
        ...(deriveRatingFilter(filters?.ratingCategory))
      }
    },
    skip: skip,
    take: takeVal,
    include: {
      rater: {
        select: {firstName: true, lastName: true, username: true, profileImage: true}
      },
      rated: {
        select: {firstName: true, lastName: true, username: true, profileImage: true}
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalCount = await prisma.rating.count({
    where: {
      OR: [
        {raterId: filters?.raterId},
        {ratedId: filters?.ratedId}
      ],
      rating: {
        ...(deriveRatingFilter(filters?.ratingCategory))
      }
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: ratings}
};

export const getRatingById = async(id: string) => {
  const rating = await prisma.rating.findFirst({
    where: {id},
    include: {
      rater: {
        select: {firstName: true, lastName: true, username: true, profileImage: true}
      },
      rated: {
        select: {firstName: true, lastName: true, username: true, profileImage: true}
      }
    }
  })
  return rating
};

interface createRatingData {
  raterId:       string
  ratedId:       string
  rating:        number,
  comment:       string
}
export const createRating = async(ratingData: createRatingData) => {
  const rating = await prisma.rating.create({
    data: ratingData
  })
  const userAverageRating = await calculateMeanUserRating(ratingData?.ratedId);
  const updatedUser = await updateUser(ratingData?.ratedId, {averageRating: userAverageRating?._avg.rating || 0});
  return rating
};


interface updateRatingData {
  rating:        number,
  comment:       string
}
export const updateRating = async (id: string, updateData: updateRatingData) => {
  const rating = await prisma.rating.update({
    where: {id},
    data: updateData
  })
  const userAverageRating = await calculateMeanUserRating(rating?.ratedId);
  const updatedUser = await updateUser(rating?.ratedId, {averageRating: userAverageRating?._avg.rating || 0});
  return rating;
};

export const calculateMeanUserRating = async(userId: string) => {
  const result = await prisma.rating.aggregate({
    where: {ratedId: userId},
    _avg: {
      rating: true
    }
  });
  return result
};

export const deleteRating = async(id: string) => {
  const data = await prisma.rating.delete({
    where: {id}
  })
  return data
};