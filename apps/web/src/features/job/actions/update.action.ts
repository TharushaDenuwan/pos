"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateJobSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateJobSchema>;

export async function updateJob(id: string, data: UpdateInput) {
  const rpcClient = await getClient();

  try {
    const parsed = updateJobSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.job[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof (errorData as any).message === "string"
          ? (errorData as any).message
          : `Failed to update job: ${result.status}`
      );
    }

    revalidatePath("/dashboard/job");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Job update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating job");
  }
}
