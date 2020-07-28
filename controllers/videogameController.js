const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Videogame = require('../models/Videogame');
const { errorHandler } = require('../helpers/dberrorHandler');

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : 'name'

  Videogame.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .exec((err, videogames) => {
      if (err) {
        return res.status(400).json({
          error: "Videogames not found"
        })
      }
      res.json(videogames);
    })
}

exports.read = (req, res) => {
  req.videogame.photo = undefined;
  return res.json(req.videogame);
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }

    const { name, description, price, category, quantity } = fields
    let videogame = new Videogame(fields);

    // 1KB = 1000 bytes
    // 1MB = 1,000,000 bytes 
    // 1 Byte = 8 bits

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be lass than 1MB in size"
        })
      }
      videogame.photo.data = fs.readFileSync(files.photo.path)
      videogame.photo.contentType = files.photo.type
    }

    videogame.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        })
      }
      res.json(result);
    })

  })
}

exports.remove = (req, res) => {
  let videogame = req.videogame
  videogame.remove((err, deletedVidegame) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json({
      message: "Videogame was deleted succesfully"
    })
  })
}

exports.videogameById = (req, res, next, id) => {
  Videogame.findById(id)
    .populate("category")
    .exec((err, videogame) => {
      if (err || !videogame) {
        return res.status(400).json({
          error: "Videogame not found"
        });
      }
      req.videogame = videogame;
      next();
    })
}

exports.photo = (req, res, next ) => {
  if (req.videogame.photo.data) {
    res.set('Content-Type', req.videogame.photo.contentType)
    return res.send(req.videogame.photo.data)
  }
  next();
}