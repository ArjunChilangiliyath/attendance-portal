
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { profileService } from '../services/profile.service.js';

export const get = asyncHandler(async (req, res) => {
  success(
    res,
    { user: profileService.get(req.user) }
  );
});

export const update = asyncHandler(async (req, res) => {
  success(
    res,
    await profileService.update(req.user.id, req.body),
    'Profile updated'
  );
});
