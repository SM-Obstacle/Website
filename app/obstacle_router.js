import express from 'express'
import path from 'path'
const router = express.Router()

router.route('/storm')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
  })
router.route('/player/:id([^/]+)')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
  })
router.route('/map/:id([^/]+)')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
  })
router.route('/maps/:id([^/]+)')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
    res.status(404)
  })
router.route('edit')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
  })
router.route('*')
  .get(function (req, res, next) {
    res.sendFile(path.resolve('./build/index.html'))
    res.status(404)
  })


export default router