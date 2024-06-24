import { prisma } from "../utils/prisma"
import type { Email } from "@prisma/client"

interface getUserFilters {
  verified: boolean
}
export const getAllEmails = async(filters: getUserFilters) => {
  const emails = await prisma.email.findMany({
    where: {
      ...(filters?.verified && {verified: filters.verified})
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return emails
};

export const getEmailByName = async(name: string) => {
  const email = await prisma.email.findFirst({
    where: {email: name}
  })
  return email
};

interface createEmailData {
  email:       string
  verified?:    boolean
  code:        number
}
export const createEmail = async(emailData: createEmailData) => {
  const email = await prisma.email.create({
    data: emailData
  })
  return email
};


interface updateEmailData {
  verified?:    boolean
  code?:        number
}
export const updateEmail = async (name: string, updateData: updateEmailData) => {
  const email = await prisma.email.update({
    where: {email: name},
    data: updateData
  })
  return email;
};

export const deleteEmail = async(email: string) => {
  const data = await prisma.email.delete({
    where: {email}
  })
  return data
};