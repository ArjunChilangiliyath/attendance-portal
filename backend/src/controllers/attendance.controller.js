
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { attendanceService } from '../services/attendance.service.js';

export const bulk = asyncHandler(async (req, res) => {
  const result = await attendanceService.bulk({
    ...req.body,
    markedById: req.user.id
  });

  success(res, result, 'Attendance marked', 201);
});

export const list = asyncHandler(async (req, res) => {
  success(
    res,
    await attendanceService.list(req.query, req.user)
  );
});

export const update = asyncHandler(async (req, res) => {
  success(
    res,
    await attendanceService.update(
      req.params.id,
      req.body,
      req.user.id
    ),
    'Attendance updated'
  );
});

export const studentHistory = asyncHandler(async (req, res) => {
  success(
    res,
    await attendanceService.studentHistory(
      req.params.id,
      req.user
    )
  );
});

export const classHistory = asyncHandler(async (req, res) => {
  success(
    res,
    await attendanceService.classHistory(
      req.params.id,
      req.user
    )
  );
});
