import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import healthRouter from './routes/health.routes.js'

const app = express()
const port = process.env.PORT || 3001

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)
app.use(express.json())

app.use('/api/health', healthRouter)

app.listen(port, () => {
  console.log(`CineVerse API listening on http://localhost:${port}`)
})
