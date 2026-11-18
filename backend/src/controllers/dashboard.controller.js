
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { dashboardService } from '../services/dashboard.service.js';

export const admin = asyncHandler(async (_req, res) => {
  success(res, await dashboardService.admin());
});

export const student = asyncHandler(async (req, res) => {
  success(
    res,
    await dashboardService.student(req.user.id)
  );
});
