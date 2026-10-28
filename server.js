import express from 'express'
import AuthRouter from './routes/auth.route.js'
import 'dotenv/config'
import userRouter  from './routes/user.route.js'
import followRouter from './routes/follow.route.js'
import FeedRouter from './routes/feed.route.js'
import commentRouter from './routes/comment.route.js'


const app = express()
const port = 3000

app.use(express.json());


app.use('/api/auth', AuthRouter);
app.use('/api/user', userRouter);
app.use('/api/follow', followRouter);
app.use('/api/feed', FeedRouter);
app.use('/api/comment', commentRouter );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})