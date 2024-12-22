import controllerWrapper from "../lib/controllerWrapper";
import { isSuperAdmin } from "../lib/utils";

export const superAdminAuthenticationMiddleware = controllerWrapper(
  async (req, res, next) => {
    if (!isSuperAdmin(req.user?.role)) {
      res.unauthorized({
        message: "Unauthorized access",
        error: "You are not authorized to perform this action.",
      });
      return;
    }

    next();
  }
);
