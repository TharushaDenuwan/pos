"use server";

import { getClient } from "@/lib/rpc/server";
import type { InsertJob } from "../schemas";

export async function createJob(data: InsertJob) {
  // Generate a unique job number (e.g., JOB-YYYYMMDD-HHMMSS-<random4>)
  function generateJobNumber() {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `JOB-${datePart}-${timePart}-${rand}`;
  }

  const jobData = {
    ...data,
    jobNumber:
      data.jobNumber && data.jobNumber.trim() !== ""
        ? data.jobNumber
        : generateJobNumber(),
    contactDetails: {
      ...data.contactDetails,
      email: data.contactDetails.email ?? "",
      workPhoneNumber: data.contactDetails.workPhoneNumber ?? "",
    },
  };

  const rpcClient = await getClient();
  const response = await rpcClient.api.job.$post({
    json: jobData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(
      errorData.message || JSON.stringify(errorData) || "Unknown error"
    );
  }

  const createdJob = await response.json();
  return createdJob;
}
