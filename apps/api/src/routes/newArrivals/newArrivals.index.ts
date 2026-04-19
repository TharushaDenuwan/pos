import { createRouter } from "@api/lib/create-app";
import * as handlers from "./newArrivals.handlers";
import * as routes from "./newArrivals.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
