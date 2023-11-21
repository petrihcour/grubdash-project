const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

// GET, List orders
function list(req, res, next) {
  res.json({ data: orders });
}

// MIDDLEWARE STATUS CODE 400 & error message validation for:
// deliverTo, mobileNumber, DISHES property is missing or empty "Order must include a ..."
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      res.locals.reqBody = data;
      return next();
    }
    next({
      status: 400,
      message: `Order must include a ${propertyName}`,
    });
  };
}

// DISHES property is not an array or is empty "Order must include at least one dish"
function dishPropertyIsValid(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: `Order must include at lease one dish`,
    });
  }
  res.locals.dishes = dishes;
  next();
}

// a dish quantity property is missing, is 0 or less, or is not an integer	"Dish ${index} must have a quantity that is an integer greater than 0"
function dishQuantityPropertyIsValid(req, res, next) {
  const { dishes } = res.locals;

  for (let index = 0; index < dishes.length; index++) {
    const dish = dishes[index];
    if (
      !dish.quantity ||
      dish.quantity <= 0 ||
      !Number.isInteger(dish.quantity)
    ) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => orderId === order.id);
  if (foundOrder) {
    res.locals.order = foundOrder;
    res.locals.orderId = orderId;
    return next();
  }
  next({
    status: 404,
    message: `No matching order is found for orderId: ${orderId}.`,
  });
}

// MIDDLEWARE if no matching order of id w/ specified orderId is found, return 404 "Order id does not match route id. Order: ${id}, Route: ${orderId}."
function validOrderId(req, res, next) {
  const { orderId } = res.locals;
  const { reqBody } = res.locals;

  if (reqBody.id) {
    if (reqBody.id === orderId) {
      return next();
    }
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${reqBody.id}, Order: ${orderId}`,
    });
  }
  return next();
}

// middleware for STATUS property is missing or empty, "Order must have a status of pending, preparing, out-for-delivery, delivered"
function statusPropertyIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatuses = [
    "pending",
    "preparing",
    "out-for-delivery",
    "delivered",
  ];

  if (status && validStatuses.includes(status)) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
  });
}

// MIDDLWARE FOR STATUS property of the existing order === "delivered"	"A delivered order cannot be changed"
function statusPropertyIsDelivered(req, res, next) {
  const { status } = res.locals;
  if (status === "delivered") {
    return next({ status: 400, message: `A delivery order cannot be changed` });
  }
  next();
}

// POST, Create an order. SAVES order and responds with NEWLY CREATED ORDER. What status code is that?????
// Use 'nextId' function to assign a new id
function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrderId = nextId();
  const orderDishes = dishes.map((dish) => ({ ...dish }));

  const newOrder = {
    id: newOrderId,
    deliverTo,
    mobileNumber,
    status,
    dishes: orderDishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// GET, Read specific order by id (MIDDLEWARE FOR NO MATCHING ORDER)
function read(req, res, next) {
  res.json({ data: res.locals.order });
}

// PUT, Update specific order id (MIDDLEWARE FOR NO MATCHING ORDER) * MUST INCLUDE SAME VALIDATION AS POST /ORDERS, AND MIDDLEWARE FOR STATUS PROPERTY MISSING OR EMPTY, & STATUS PROPERTY OF EXISTING ORDER === DELIVERED
function update(req, res, next) {
  const { order } = res.locals;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

// MIDDLEWARE VALIDATION for STATUS property of the order !== "pending", "An order cannot be deleted unless it is pending. Returns a 400 status code"
function statusPropertyPending(req, res, next) {
  const { order } = res.locals;
  if (order.status === "pending") {
    return next();
  }
  next({
    status: 400,
    message: `An order cannot be deleted unless it is pending`,
  });
}

// DELETE, Destroy specific order id, return 204 message where id === :orderId and NO RESPONSE BODY, or return 404 if no matching order found. USE VALIDATION FOR ORDER !== PENDING
function destroy(req, res, next) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("dishes"),
    dishPropertyIsValid,
    dishQuantityPropertyIsValid,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    bodyDataHas("status"),
    bodyDataHas("dishes"),
    dishPropertyIsValid,
    dishQuantityPropertyIsValid,
    validOrderId,
    statusPropertyIsValid,
    statusPropertyIsDelivered,
    update,
  ],
  delete: [orderExists, statusPropertyPending, destroy],
};
