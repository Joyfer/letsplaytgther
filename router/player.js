const express = require('express');
const router = express.Router();

router.get("/:roomt", (req, res) => {
    res.render("player");
});


module.exports = router;