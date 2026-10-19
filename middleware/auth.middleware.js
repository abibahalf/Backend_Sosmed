import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const authMiddleware = async (req, res, next) => {
    const JWTSECRET = process.env.JWT_SECRET

    try{
        const headers = req.headers.authorization

        if (!headers) {
            return res.status(401).json({ message: 'Authorization Error, token belum diinput' });
        }

        const [scheme, token] = headers.split(' ');
if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Format Authorization harus Bearer <token>' });
}

        // const token = headers.split("Bearer")[1] // Mengambil token setelah 'Bearer '
        const decoded = jwt.verify(token, JWTSECRET);
        

        const currentUser = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })
      // Menyimpan informasi user di request object

       

        req.user = {
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            fullname: currentUser.fullname,
            image: currentUser.image,
            bio: currentUser.bio,
                
        }

        next();
    }catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server Down'});
    }
}