
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { studentService } from '../services/student.service.js';

export const list = asyncHandler(async (req, res) => {
  success(
    res,
    await studentService.list(req.query)
  );
});

export const get = asyncHandler(async (req, res) => {
  success(
    res,
    await studentService.get(req.params.id)
  );
});

export const create = asyncHandler(async (req, res) => {
  success(
    res,
    await studentService.create(req.body),
    'Student created. Password setup email requested from Auth0.',
    201
  );
});

export const update = asyncHandler(async (req, res) => {
  success(
    res,
    await studentService.update(req.params.id, req.body),
    'Student updated'
  );
});

export const remove = asyncHandler(async (req, res) => {
  success(
    res,
    await studentService.remove(req.params.id),
    'Student deactivated'
  );
});
