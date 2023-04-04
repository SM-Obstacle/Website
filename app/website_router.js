import express from 'express'
import path from 'path'
import ressource_fetcher from './ressource_fetcher.js'
const router = express.Router()

router.route('/storm')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'), {foo: 'FOO'})
  })
router.route('/servers')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'), {servers_list: ressource_fetcher.servers_list})
  })
router.route('/player/:id([^/]+)')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'), {foo: 'FOO'})
  })
router.route('/map/:id([^/]+)')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'), {foo: 'FOO'})
  })
router.route('/maps/:id([^/]+)')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'))
    res.status(404)
  })
router.route('edit')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'))
  })
router.route('*')
  .get(function (req, res, next) {
    res.render(path.resolve('./public/index'))
    res.status(404)
  })


export default router