import { Request, Response } from "express";
import { decodeToken } from "../../services/tokenService";

function authValidation (req: any , res: any, next: any){
  try {
    const {authorization} = req.headers;
    let token = authorization?.split(" ")[1]
    let user = decodeToken(token || "")
    //console.log(user)
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: `UnAuthorized!! ${error}`,
      status: "error",
      statusCode: 401,
    })
  }
  
}

export default authValidation