const express = require('express');
const router = express.Router();

router.get("/:room", (req, res) => {
    const roomurl= req.params.room
    if( roomurl.length < 10 ){      
        res.render("player", {roomy: roomurl});
    } else {
        res.status(404).render("404")
    }
});


module.exports = router;