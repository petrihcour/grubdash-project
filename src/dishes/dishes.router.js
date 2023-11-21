const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

// GET, POST /dishes 

router.route("/").get(controller.list);

router.route("/:dishId").delete(methodNotAllowed);

module.exports = router;
