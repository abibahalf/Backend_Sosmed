import express from 'express'
import AuthRouter from './routes/auth.route.js'
import 'dotenv/config'
import userRouter  from './routes/user.route.js'
import followRouter from './routes/follow.route.js'


const app = express()
const port = 3000

app.use(express.json());


app.use('/api/auth', AuthRouter);
app.use('/api/user', userRouter);
app.use('/api/follow', followRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})