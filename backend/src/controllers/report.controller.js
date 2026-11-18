
import { asyncHandler } from '../utils/async-handler.js';
import { success } from '../utils/response.js';
import { reportService, exportAttendanceCsv } from '../services/report.service.js';

export const student = asyncHandler(async (req, res) => {
  success(
    res,
    await reportService.student(req.params.id)
  );
});

export const klass = asyncHandler(async (req, res) => {
  success(
    res,
    await reportService.class(req.params.id)
  );
});

export const exportCsv = asyncHandler(async (req, res) => {
  const csv = await exportAttendanceCsv(req.query);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="attendance-report.csv"'
  );

  res.send(csv);
});
