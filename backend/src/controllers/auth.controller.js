
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';

export const me = asyncHandler(async (req, res) => {
  success(res, { user: req.user }, 'Authenticated user');
});
