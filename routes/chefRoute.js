const express = require("express")
const { getChefById } = require("../controllers/chefController")

const router = express.Router()

router.get("/:id", getChefById)

module.exports = router