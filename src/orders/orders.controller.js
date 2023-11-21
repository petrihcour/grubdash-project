const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


// GET, List orders

// MIDDLEWARE STATUS CODE 400 & error message validation for:
// deliverTo property is missing or empty "Order must include a deliverTo"
// mobileNumber property is missing	or empty "Order must include a mobileNumber"
// DISHES property is missing "Order must include a dish"
// DISHES property is not an array or is empty "Order must include at least one dish"
// a dish quantity property is missing, is 0 or less, or is not an integer	"Dish ${index} must have a quantity that is an integer greater than 0"

// MIDDLEWARE if no matching order of id w/ specified orderId is found, return 404 "Order id does not match route id. Order: ${id}, Route: ${orderId}."

// middleware for STATUS property is missing or empty, "Order must have a status of pending, preparing, out-for-delivery, delivered"

// MIDDLWARE FOR STATUS property of the existing order === "delivered"	"A delivered order cannot be changed"


// POST, Create an order. SAVES order and responds with NEWLY CREATED ORDER. What status code is that?????
// Use 'nextId' function to assign a new id

// GET, Read specific order by id (MIDDLEWARE FOR NO MATCHING ORDER)

// PUT, Update specific order id (MIDDLEWARE FOR NO MATCHING ORDER) * MUST INCLUDE SAME VALIDATION AS POST /ORDERS, AND MIDDLEWARE FOR STATUS PROPERTY MISSING OR EMPTY, & STATUS PROPERTY OF EXISTING ORDER === DELIVERED 

// MIDDLEWARE VALIDATION for STATUS property of the order !== "pending", "An order cannot be deleted unless it is pending. Returns a 400 status code"

// DELETE, Destroy specific order id, return 204 message where id === :orderId and NO RESPONSE BODY, or return 404 if no matching order found. USE VALIDATION FOR ORDER !== PENDING

