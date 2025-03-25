const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.userType)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  