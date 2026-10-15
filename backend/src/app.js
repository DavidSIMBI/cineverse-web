import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import healthRouter from './routes/health.routes.js'
import moviesRouter from './routes/movies.routes.js'
import ApiError from './utils/api-error.js'

const app = express()
const port = process.env.PORT || 3001

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/movies', moviesRouter)

app.use((error, _request, response, _next) => {
  if (error instanceof ApiError) {
    return response.status(error.status).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    })
  }

  console.error('Unhandled API error:', error.message)
  return response.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  })
})

app.listen(port, () => {
  console.log(`CineVerse API listening on http://localhost:${port}`)
})
