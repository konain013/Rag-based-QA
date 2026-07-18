const authorize = (role) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check user role
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // User is authorized
    next();
  };
};

module.exports = authorize;