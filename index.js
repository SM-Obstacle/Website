import express from 'express'
import cors from 'cors'
import obstacle_router from './app/obstacle_router.js'
const app = express()

app.use(express.static('./build'))
app.use(obstacle_router)

app.listen('8000')