import logger from '../util/logger';

export const apiErrorHandler = (err, req, res, next) => {
  logger.warn(JSON.stringify(err));

  res.status(err.status || 500);
  
  if (err.code === 'permission_denied') {
    res.status(403);
    err.message = 'Permision denied';
  }

  if(err.code === 'user_object_not_found'){
    res.status(401);
    err.message = 'Unauthorized';
  }

  const response = {
    message: err.message
  };

  res.send(response);
};
