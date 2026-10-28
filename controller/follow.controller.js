import prisma from "../utils/prisma.js"

export const followUserAccount = async (req, res) => {

    //inputan current user follow user
    const currentUserId = req.user.id

    const { followUserId } = req.body

    //check jika current user sama dengan followerUserId
    if(currentUserId === followUserId){
        return res.status(400).json({
            message: " tidak bisa follow akun sendiri"
        })
    }

    const otherUserId = await prisma.user.findUnique({
        where: {
            id: Number(followUserId)
        }
    })

    if (!otherUserId){
        return res.status(404).json({
            message: "User id tidak ditemukan"
        })
    }

    const isFollowUser = await prisma.follow.findUnique({
        where:{
            followerId_followingId:{
                followerId: Number(followUserId),
                followingId: Number(currentUserId)
            }
        }
    })

    if (isFollowUser){
        return res.status(400).json({
            message: "user sudah pernah di follow"
        })
    }

    try {
        const follow =await prisma.follow.create({
            data:{
                followerId: followUserId,
                followingId: currentUserId
            }
        })

        //update user count
        await prisma.user.update({
            where:{
                id: currentUserId
            },
            data: {
                followingCount:{
                    increment: 1
                }
            }
        })
        await prisma.user.update({
            where:{
                id: followUserId
            },
            data: {
                followerCount:{
                    increment: 1
                }
            }
        })

        res.status(200).json({
            message: "follow user Berhasil",
            data: follow
        })


    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "server down"
        })
    }
}


git add controller/user.controller.js routes/user.route.js server.js utils/cloudinary.js controller/follow.controller.js routes/follow.route.js

