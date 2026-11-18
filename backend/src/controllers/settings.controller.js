
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { settingsService } from '../services/settings.service.js';

export const list = asyncHandler(async (_req, res) => {
  success(res, await settingsService.list());
});

export const update = asyncHandler(async (req, res) => {
  success(
    res,
    await settingsService.update(req.body.settings),
    'Settings updated'
  );
});
