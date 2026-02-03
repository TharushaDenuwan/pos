import rpc from "@nextplate/rpc";

import { env } from "@/lib/env";

export const client = rpc(env.NEXT_PUBLIC_BACKEND_URL!);
