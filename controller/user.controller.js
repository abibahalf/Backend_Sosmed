import prisma from "../utils/prisma.js"
import * as z from "zod"; 



export const getUserbyUsername = async (req, res) => {
    const {username} = req.params

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            omit: {
                password: true,
                imageId: true
            }
        })

        if(!user){
            return res.status(400).json({message: "username tidak di temukan"})
        }

        res.status(200).json({
        
            message: "Detail User",
            data : user
        })
        
    } catch (error) {
        return res.status(500).json({message: " Server down"})
        
    }
}

export const getSearchUser = async (req, res) => {
    const {username}  = req.query

    if (!username){
        return res.status(400).json({message: " Parameter query username belum disisi"})
    }
    
    const users = await prisma.user.findMany({
        where:{
            username: {
                contains:username, 
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            image: true
        }
    })

    if (users.length ===0){
        return  res.status(400).json({
            message: "username tidak ditemukan"
        })
    }

    res.status(200).json({
        message: "Searching User",
        data: users
    })
}




export const  updateUser = async (req, res) => {

    try {
        
        // Validation dengan zod
        const userSchema = z.object({
                    fullname: z.string().min(6, "Fullname minimal 6 karakter"),
                    username: z.string().min(6, "Username minimal 6 karakter"),
                    bio: z.string().min(10, "Bio Data minimal 10 karakter")
        
                })
        const validateed = userSchema.parse(req.body)

    
        //validation untuk username
        const currenUser = await prisma.user.findUnique({
            where: {
                username: validateed.username
            }
        })

        if(currenUser){
            return res.status(400).json({
                message: "Username Sudah Di gunakan, Silakan gunakan username laian"
            })
        }
    
        //validation berdasarkan req user id
        const updateUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data : {
                bio: validateed.bio,
                username: validateed.username,
                fullname: validateed.fullname
            },
            omit: {
                password: true
            }
        })
    
        // Response Success
        res.status(200).json({
                message: "Update User Berhasil",
                data: updateUser
            })

    } catch (error) {
 if ( error instanceof Error && 'issues' in error) {
            //error dari zod
            const zodError = error;
            const errorMessages = zodError.issues.map(issue => issue.message);
            return res.status(400).json({ Message: errorMessages });
        }

        //error dari express
        console.log(error);
        res.status(500).json({message: 'Server Down'});
    }
}