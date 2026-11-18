
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { classService } from '../services/class.service.js';

export const list = asyncHandler(async (_req, res) => {
  success(res, await classService.list());
});

export const create = asyncHandler(async (req, res) => {
  success(
    res,
    await classService.create(req.body),
    'Class created',
    201
  );
});

export const update = asyncHandler(async (req, res) => {
  success(
    res,
    await classService.update(req.params.id, req.body),
    'Class updated'
  );
});

export const remove = asyncHandler(async (req, res) => {
  success(
    res,
    await classService.remove(req.params.id),
    'Class deactivated'
  );
});

export const students = asyncHandler(async (req, res) => {
  success(
    res,
    await classService.students(req.params.id, req.user)
  );
});
