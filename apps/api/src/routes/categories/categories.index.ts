import { createRouter } from "@api/lib/create-app";

import * as handlers from "./categories.handlers";
import * as routes from "./categories.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.addSubcategory, handlers.addSubcategory)
  .openapi(routes.removeSubcategory, handlers.removeSubcategory)
  .openapi(routes.getProductsByCategory, handlers.productsByCategory);

export default router;
