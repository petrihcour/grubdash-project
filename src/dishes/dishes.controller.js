const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes handlers needed to make the tests pass

// GET, List dishes
function list(req, res) {
  res.json({ data: dishes });
}

// MIDDLEWARE STATUS CODE 400 & error message validation for:
// NAME, DESCRIPTION, PRICE. IMAGE_URL property missing or empty "Dish must include a ..."
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      res.locals.reqBody = data;
      return next();
    }
    next({ status: 400, message: `Dish must include a ${propertyName}` });
  };
}

// has PRICE that is 0 or less, and is not an integer "Dish must have a price that is an integer greater than 0"
function priceIsValidNumber(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  }
  next();
}

// POST, Create a dish
// Use 'nextId' function to assign a new id
function create(req, res, next) {
  const newDishId = nextId();
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newDish = {
    id: newDishId,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// MIDDLEWARE VALIDATION FOR dish not existing "Dish does not exist: ${dishId}."
// MIDDLEWARE validation for valid dish, return 404 if dish not found "Dish does not exist: ${dishId}."
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dishId === dish.id);

  if (foundDish) {
    res.locals.dish = foundDish;
    res.locals.dishId = dishId;
    return next();
  }

  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

// MIDDLEWARE FOR id in the body does not match :dishId in the route   /	"Dish id does not match route id. Dish: ${id}, Route: ${dishId}"
function bodyIdMatchesRouteId(req, res, next) {
  const { dishId } = res.locals;
  const { reqBody } = res.locals;

  if (reqBody.id) {
    if (reqBody.id === dishId) {
      return next();
    }
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${reqBody.id}, Route: ${dishId}`,
    });
  }
  return next();
}

// GET, Read specific dish by id (MIDDLEWARE FOR VALID DISH)
function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

// PUT, Update specific dish id (MIDDLEWARE FOR VALID DISH)
function update(req, res, next) {
  const { dish } = res.locals;
  const { data: { name, description, price, image_url } = {} } = req.body;

  // Update dish
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

// DELETE, Destroy specific dish id. DISHES CANNOT BE DELETED!
function destroy(request, response, next) {
  methodNotAllowed(request, response, next);
}

module.exports = {
  list,
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    priceIsValidNumber,
    create,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    priceIsValidNumber,
    bodyIdMatchesRouteId,
    update,
  ],
  methodNotAllowed,
};
