let router = require("express").Router();

router.use("/admin", require("./admin"));
router.use("/user", require("./users"));

module.exports = router;
