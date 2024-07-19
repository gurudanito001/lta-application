import { prisma } from "../utils/prisma"
import type { Email } from "@prisma/client"

interface getReportFilters {
  reporterId: string,
  offenderId: string
}

export const getAllReports = async(filters: getReportFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const reports = await prisma.report.findMany({
    where: {
      OR: [
        {reporterId: filters.reporterId},
        {offenderId: filters.offenderId}
      ]
    },
    skip: skip,
    take: takeVal,
    include: {
      reporter: {
        select: {firstName: true, lastName: true, username: true}
      },
      offender: {
        select: {firstName: true, lastName: true, username: true}
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalCount = await prisma.report.count({
    where: {
      ...(filters?.reporterId && {reporterId: filters.reporterId}),
      ...(filters?.offenderId && {offenderId: filters.offenderId})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: reports}
};

export const getReportById = async(id: string) => {
  const report = await prisma.report.findFirst({
    where: {id},
    include: {
      reporter: {
        select: {firstName: true, lastName: true, username: true}
      },
      offender: {
        select: {firstName: true, lastName: true, username: true}
      }
    },
  })
  return report
};

interface createReportData {
  reporterId:       string
  offenderId:      string
  reason:           string
}
export const createReport = async(reportData: createReportData) => {
  const report = await prisma.report.create({
    data: reportData
  })
  return report
};


interface updateReportData {
  reason:           string
}
export const updateReport = async (id: string, updateData: updateReportData) => {
  const report = await prisma.report.update({
    where: {id},
    data: updateData
  })
  return report;
};

export const deleteEmail = async(id: string) => {
  const data = await prisma.report.delete({
    where: {id}
  })
  return data
};