const express = require('express');
const router = express.Router();

router.get("/:room", (req, res) => {
    const roomurl= req.params.room
    res.render("player", {roomy: roomurl});
});


module.exports = router;