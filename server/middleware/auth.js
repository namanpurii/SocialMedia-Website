//THIS MIDDLEWARE IS STRICTLY USED FOR AUTHORIZING USERS AT NECESSARY END POINTS

import jwt from "jsonwebtoken"
import fs from "fs"
export const verifyToken = async (res, req, next) => {
    try{
        let token = req.header("Authorization")
        if(!token) {
            return res.status(403).send('Access Denied')
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft()
        }
        var privateKey = fs.readFileSync('private.key');
        const verify = jwt.verify(token, privateKey)
        req.user = verified
        next()
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}