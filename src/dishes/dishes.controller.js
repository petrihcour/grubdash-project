const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// GET, List dishes

// MIDDLEWARE validation for valid dish, return 404 if dish not found "Dish does not exist: ${dishId}."

// MIDDLEWARE STATUS CODE 400 & error message validation for:
// NAME property missing or empty "Dish must include a name"
// DESCRIPTION property missing or empty "Dish must include a description"
// PRICE property missing, "Dish must include a price"
// has PRICE that is 0 or less, and is not an integer "Dish must have a price that is an integer greater than 0"
// IMAGE_URL property missing or empty "Dish must include a image_url"

// MIDDLEWARE FOR id in the body does not match :dishId in the route   /	"Dish id does not match route id. Dish: ${id}, Route: ${dishId}"

// POST, Create a dish
// Use 'nextId' function to assign a new id

// GET, Read specific dish by id (MIDDLEWARE FOR VALID DISH)

// PUT, Update specific dish id (MIDDLEWARE FOR VALID DISH)

// DELETE, Destroy specific dish id. DISHES CANNOT BE DELETED!

