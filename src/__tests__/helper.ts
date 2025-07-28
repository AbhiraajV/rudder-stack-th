import { prisma } from "../../prisma/prisma";

export async function resetDatabase() {
  await prisma.trackingPlanEventProperty.deleteMany({}); 
  await prisma.trackingPlanEvent.deleteMany({});         
  await prisma.trackingPlan.deleteMany({});              
  await prisma.property.deleteMany({});                  
  await prisma.event.deleteMany({});                     
}
