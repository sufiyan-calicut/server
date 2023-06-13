import jwt from "jsonwebtoken";

// ----------------------------------------------------------------GENERATE TOKEN--------------------------------------------------------------//

export const generateToken = async(data) => {
    try {
        return await new Promise((resolve) => {
            const token  = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '60d' })
            resolve(token)
        })
    } catch (err) {
        console.log(err)
    }
}