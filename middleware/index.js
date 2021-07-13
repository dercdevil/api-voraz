const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
const models = require("../models");

const returnUserByToken = async (req) => {
  let token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, constants.secretTokenKey);
    return models.User.findOne({ where:{id: decoded.id}});
  } catch (error) {
    return false;
  }
};

const isAdmin = async (req,res,next) => {
  const user = await returnUserByToken(req);
  if( user.role !== 'ADMINISTRADOR' ) 
    return res.status(401).json({ message: "Unauthorized!" });
  next();
}


const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  try {
    
    const user = await returnUserByToken(req);
    if (!user) return res.status(401).json({ message: "Su sesion ha expirado" });   
    if (!user.status) return res.status(403).json({ message: "Usuario desactivado" });   

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};
module.exports = {
  verifyToken,
  returnUserByToken,
  isAdmin,
}