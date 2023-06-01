const express = require("express");
const router = express.Router();
const { addEmployee, deleteEmployee, getEmployees, getSingleEmployee, updateEmployee} = require("../controllers/employeesController");
const roles = require("../middleware/rolesMiddleware");
const { admin,editer,user } = require("../config/roles");

router.get("/", roles([admin, editer]), getEmployees);
router.post("/", roles([admin, editer]), addEmployee);
router.get("/:id", roles([admin]), getSingleEmployee);
router.patch("/:id", roles([admin]), updateEmployee);
router.delete("/:id", roles([admin]), deleteEmployee);

module.exports = router;
