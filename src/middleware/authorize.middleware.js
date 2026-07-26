const authorize = (...allowedRoles) => {
  const roles =
    allowedRoles.length === 1 && Array.isArray(allowedRoles[0])
      ? allowedRoles[0]
      : allowedRoles;

  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = authorize;