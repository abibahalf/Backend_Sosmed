import prisma from "../utils/prisma.js"

export const createComment = async (req,res) => {
    try {
        const currentUserId = req.user.id
        const { postId, content } = req.body

        // Validation 1
        if (!postId || !content) {
            res.status(400).json({
                message: "Inputan Post Dan Comment Wajib Diisi"
            })
        }
        
        // Validation 2
        
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData) {
            return res.status(404).json({
                message:"Post Tidak Di Temukan"
            })
        }

        // Insert Data Comment
        const newComment = await prisma.comment.create({
            data: {
                userId: Number(currentUserId),
                postId: Number(postId),
                content,
            }
        });

        // Update Post Count
        await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                commentCount: {increment: 1}
            }
        });


        res.status(200).json({
            message:" Comment Berhasil",
            data: newComment,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: " Server Down",
            error
        })
    }
}

export const deleteCommentById = async (req, res) => {
    const {id} = req.params

    const currentUserId = req.user.id

    const comment = await prisma.comment.findUnique({
        where: {
            id: Number(id)
        }
    })

    if (!comment){
        return res.status(404).json({
            message: " Comment Not Found"
        })
    }

    if (comment.userId != currentUserId){
        return res.status(400).json({
            message: " Anda Tidak Bisa Menghapus Comment User Lain"
        })
    }

    // Delete Comment
    await prisma.comment.delete({
        where: {
            id: Number(id)
        }
    })

    // Validasi Update CommentCount Berkurang
    await prisma.post.update({
        where: {
            id: Number(comment.postId)
        },
        data: {
            commentCount: {decrement: 1}
        }
    })

    res.status(200).json({
        message: "Delete Comment Berhasil"
    })








}