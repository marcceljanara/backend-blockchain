/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userId;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: 'Token tidak valid' });
  }
};


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.userId;
    next();
  });

};