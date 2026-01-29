const express = require("express");
const { createUser, listUsers, updateUser } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;
