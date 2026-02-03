import { createRouter } from "@api/lib/create-app";
import { AppOpenAPI } from "@api/types";

import { BASE_PATH } from "../lib/constants";
// import housing from "./housing/housing.index";
import index from "./index.route";
import job from "./job/job.index";
import media from "./media/media.index";
import task from "./task/task.index";
import tasks from "./tasks/tasks.index";
import worker from "./worker/worker.index";
import worker_categories from "./worker_categories/worker_categories.index";
import worker_skills from "./worker_skills/worker_skills.index";

export function registerRoutes(app: AppOpenAPI) {
  return (
    app
      .route("/", index)
      .route("/tasks", tasks)
      // .route("/categories", categories)
      // .route("/products", products)
      // .route("/cart", cart)
      // .route("/orders", orders)
      .route("/media", media)
      // .route("/housing", housing)
      .route("/job", job)
      .route("/task", task)
      .route("/worker", worker)
      .route("/worker_categories", worker_categories)
      .route("/worker_skills", worker_skills)
  );
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_PATH));

export type Router = typeof router;
