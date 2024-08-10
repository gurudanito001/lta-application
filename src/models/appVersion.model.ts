import { prisma } from "../utils/prisma"
import type { AppVersion } from "@prisma/client"


export const getAllAppVersions = async(pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const appVersions = await prisma.appVersion.findMany({
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.appVersion.count();
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: appVersions}
};

export const getAppVersionById = async(id: string) => {
  const appVersion = await prisma.appVersion.findFirst({
    where: {id}
  })
  return appVersion
};

interface createAppVersionData {
  version:                  string
  message:                  string
  force?:                   boolean
}
export const createAppVersion = async(appVersionData: createAppVersionData) => {
  const appVersion = await prisma.appVersion.create({
    data: appVersionData
  })
  return appVersion
};


interface updateAppVersionData {
  version?:                  string
  message?:                  string
  force?:                   boolean
}
export const updateAppVersion = async (id: string, updateData: updateAppVersionData) => {
  const appVersion = await prisma.appVersion.update({
    where: {id},
    data: updateData
  })
  return appVersion;
};

export const deleteAppVersion = async(id: string) => {
  const appVersion = await prisma.appVersion.delete({
    where: {id}
  })
  return appVersion
};