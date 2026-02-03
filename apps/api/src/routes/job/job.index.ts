import { createRouter } from "@api/lib/create-app";

import * as handlers from "./job.handlers";
import * as routes from "./job.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.listByStatus, handlers.listByStatus)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
