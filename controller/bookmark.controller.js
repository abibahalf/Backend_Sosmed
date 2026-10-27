
import prisma from "../utils/prisma.js"

export const toggleSaveFeed = async (req,res) => {
    
    const currentUserId = req.user.id
    const {postId} = req.params

    try {

        // Validation
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!postData){
            return res.status(404).json({
                message: "Post/Feed Tidak Ditemukan"
            });
        }

        // 2. Cek apakah sudah dibookmark sebelumnya (untuk fitur toggle)
        const checkUserBookmark = await prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    postId: Number(postId),
                    userId: Number(currentUserId)
                }
            }
        });

        if (checkUserBookmark) {
            // Jika sudah ada, hapus (Unsave)
            await prisma.bookmark.delete({
                where: {
                    postId_userId: {
                        postId: Number(postId),
                        userId: Number(currentUserId)
                    }
                }
            });
            return res.status(200).json({ message: "Post Berhasil Dihapus dari Bookmark" });
        } else {
            // Jika belum ada, buat baru (Save)
            const newBookmark = await prisma.bookmark.create({
                data: {
                    postId: Number(postId),
                    userId: Number(currentUserId),
                }
            });
            return res.status(201).json({ message: "Post Berhasil Disimpan", data: newBookmark });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Down",
            error
        })
    }
}

export const checkSavedFeed = async (req,res) => {

    try {
        const { postId} = req.params
        const currentUserId = req.user.id

        const checkSaved = await prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if(checkSaved) {
            return res.status(200).json({
                data: true
            })
        }
        
        return res.status(200).json({
                data: false
            })
        
    } catch (error) {
        res.status(500).json({
            message: " Server Down"
        })
    }
}