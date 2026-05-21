import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
// import housing from "./housing/housing.index";
import index from "./index.route";
import media from "./media/media.index";
import newArrivals from "./newArrivals/newArrivals.index";
import orderItems from "./orderItems/orderItems.index";
import orders from "./orders/orders.index";
import products from "./products/products.index";
import reviews from "./reviews/reviews.index";
import roles from "./roles/roles.index";
import staffProfiles from "./staffProfiles/staffProfiles.index";
import task from "./task/task.index";
import tasks from "./tasks/tasks.index";
import users from "./users/users.index";
import worker from "./worker/worker.index";
import worker_categories from "./worker_categories/worker_categories.index";
import worker_skills from "./worker_skills/worker_skills.index";
import matirialManagement from "./matirialManagement/matirialManagement.index";
import hireManagement from "./hireManagement/hireManagement.index";
import savingsBank from "./savingsBank/savingsBank.index";
export function registerRoutes(app: AppOpenAPI) {
  return (
    app
      .route("/", index)
      .route("/tasks", tasks)
      .route("/users", users)
      .route("/roles", roles)
      .route("/products", products)
      .route("/orders", orders)
      .route("/staff-profiles", staffProfiles)
      .route("/reviews", reviews)
      .route("/new-arrivals", newArrivals)
      .route("/order-items", orderItems)
      .route("/media", media)
      .route("/task", task)
      .route("/worker", worker)
      .route("/worker_categories", worker_categories)
      .route("/worker_skills", worker_skills)
      .route("/matirial-management", matirialManagement)
      .route("/hire-management", hireManagement)
      .route("/savings-bank", savingsBank)
  );
}
// Trigger reload


// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
