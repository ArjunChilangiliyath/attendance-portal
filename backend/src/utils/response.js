
/**
 * Send a standardized success response.
 */
export const success = (
  res,
  data = null,
  message = 'Success',
  status = 200,
  meta = null
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
};
