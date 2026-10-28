import express from 'express'
import AuthRouter from './routes/auth.route.js'
import 'dotenv/config'
import userRouter  from './routes/user.route.js'
import followRouter from './routes/follow.route.js'
import FeedRouter from './routes/feed.route.js'
import commentRouter from './routes/comment.route.js'
import LikeRouteer from './routes/like.route.js'
import BookmarkRouter from './routes/bookmark.route.js'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.json());


app.use('/api/auth', AuthRouter);
app.use('/api/user', userRouter);
app.use('/api/follow', followRouter);
app.use('/api/feed', FeedRouter);
app.use('/api/comment', commentRouter );
app.use('/api/like', LikeRouteer );
app.use('/api/bookmark', BookmarkRouter );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})