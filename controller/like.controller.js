import prisma from "../utils/prisma.js"

export  const LikeFeedUser = async (req, res) => {
    
    // Request 
    const currentUserId = req.user.id
    const {postId} = req.params

    try {
        // Validation
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData){
            return res.status(404).json({
                message: " Post/Feed Tidak Ditemukan"
            })
        }

        // Check Jika User Sudah Menglike Post Tersebut
        const checkLike = await prisma.likes.findUnique({
            where: {
                postId_userId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (checkLike) {
            await prisma.likes.delete({
                where: {
                    postId_userId: {
                        userId: currentUserId,
                        postId: Number(postId)
                    }
                }
            })

            await prisma.post.update({
                where:{
                    id: Number(postId)
                },
                data: {
                    likeCount: {decrement : 1}
                }
            
            })

            return res.status(200).json({
                message: "Unike Feed Berhasil",
            })
        }
        
        // Insert Data Like
        const newLike = await prisma.likes.create({
            data: {
                userId: currentUserId,
                postId: Number(postId)
            }
        })

        // Update Post
        await prisma.post.update({
            where:{
                id: Number(postId)
            },
            data: {
                likeCount: {increment : 1}
            }
            
        })

        // Respons Berhasil
        res.status(201).json({
            message: "Berhasil Like Feed",
            data: newLike
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}


export const CheckLikeUser = async (req,res) => {
    const {postId} = req.params
    const currentUserId = req.user.id

    try {
        // Validation
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData){
            return res.status(404).json({
                message: " Post/Feed Tidak Ditemukan"
            })
        }

        const checkLike = await prisma.likes.findUnique({
            where: {
                postId_userId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (checkLike) {
            return res.status(200).json({
                data : true
            })
        }

        return res.status(200).json({
            data : false
        })
        



    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Down"
        })
        
    }
}