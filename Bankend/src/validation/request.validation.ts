import { request } from "http";
import { z } from "zod";

export const requestValidationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(3, "Description is required"),
  status : z.enum(["CREATED", "APPROVED","REJECTED", "CLOSED"]).default("CREATED"),
  assigned_to: z.string().min(3, "Assigned to is required"),
  created_by: z.string()

});

export const requestUpdateValidationSchema = z.object({
  request_id: z.string().min(3, "Request id is required"),
  status : z.enum(["CREATED", "APPROVED","REJECTED", "CLOSED"]).default("CREATED"),
  remarks: z.string().optional(),
  
});

export const requestLogValidationSchema = z.object({
  request_id: z.string().min(3, "Request id is required"),
  title: z.string().min(3, "Title is required"),
  description: z.string().min(3, "Description is required"),
  created_by: z.string().min(3, "Created by is required"),
});


