/**
 * Author: Greg Seal
 * Date: October 2022
 * Course:  Intermediate app development
 *
 * For retrieving get request data from the cache
 *
 * cacheRoute: checks for and displays stored get request data
 */

import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 310,
});

/**
 * This function checks for and displays stored get request data
 * @param {Request} req
 * @param {Response} res
 * @return {object} cachedRes
 * @returns {Function} next()
 */
const cacheRoute = (req, res, next) => {
  const key = req.originalUrl + req.headers.authorization;
  const cachedRes = cache.get(key);
  if (req.method !== 'GET' && cachedRes) {
    cache.del(key);
    return next();
  }
  if (cachedRes) {
    return res.json(cachedRes);
  }
  res.originalSend = res.json;
  res.json = (body) => {
    res.originalSend(body);
    cache.set(key, body);
  };
  return next();
};
export default cacheRoute;
