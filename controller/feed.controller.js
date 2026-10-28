import prisma from "../utils/prisma.js"
import cloudinary from "../utils/cloudinary.js"

export const CreateFeed = async (req, res) => {
    try {
        const {caption} = req.body
        const currentUserId = req.user.id

        // Validation 
        if (!caption) {
            return res.status(400).json({
                message: " Caption Wajin Diisi"
            })
        }

        if(!req.file) {
            return res.status(400).json({
                message: " File Gambar Belum Di Input"
            })
        }

         //upload gambar dengan buffer multer
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        
        const result = await cloudinary.uploader.upload(fileStr, {
            folder: 'feeds',
            transformation: [{
            aspect_rasio: "4:5", crop: "fill", gravity: "auto"
            },
            {
                quality: 'auto',
                fetch_format: 'auto'
            }]
        })

        // Buat postingan feed baru
        const newFeed = await prisma.post.create({
            data: {
                caption,
                image: result.secure_url,
                imageId: result.public_id,
                userId: currentUserId
            }
        })

        // Update Data User
         await prisma.user.update({
            where: {
                id: Number(currentUserId)
            },
            data: {
                postsCount: {
                    increment: 1
                }
            }
        })

        // Response 
        res.status(200).json({
            message: " Feed Berhasil Dibuat",
            data: newFeed
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: " Server Down",
            error
        })
        
    }
}


export const ReadAllFeeds = async (req, res) => {

    try {
        const posts = await prisma.post.findMany(
            {
                include:{
                    user:{
                        select:{
                            id: true,
                            fullname: true,
                            username: true,
                            image: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc'}
            },
           
        )
        

        res.status(200).json({
            message: " Get All Post",
            data: posts
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: " Server Down",
            error
        })
    }
}

export const DetailFeed =  async (req,res) => {
    const {id} = req.params
    try {
        const post = await prisma.post.findUnique({
            where:{
                id: Number(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        username: true,
                        image: true
                    }
                }
            }
        })

        if(!post){
            return res.status(404).json({
                message: "POst Tidak Ditemukan"
            })
        }

        res.status(200).json({
            message: " Get Detail Feed",
            data: post
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: " Server Down",
            error
        })
    }
}

export const DeleteFeed = async (req, res) => {
    
    const {id} = req.params
    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })

         if(!postData){
            return res.status(404).json({
                message: "Feed Tidak Ditemukan"
            })
        }

        if (postData.userId != req.user.id) {
             return res.status(400).json({
                message: "Anda Tidak Bisa Menghapus Feed User Lain"
            })
        }

        if (postData.imageId) {
            await cloudinary.uploader.destroy(postData.imageId)
        }

        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({
            message: " Data Feed Berhasil Di hapus",
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Down"
        })


    }
}


