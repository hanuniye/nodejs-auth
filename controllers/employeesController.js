const employeeDB = require("../model/employeeModel");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require("http-status-codes").StatusCodes;


const addEmployee = async (req, res) => {
    const { name, title, gender } = req.body;

    if(!name || !title || !gender) return res.status(BAD_REQUEST).json({msg: "missing fields"});
    try {
        const employee = await employeeDB.create({name,title,gender,status: true});
        if(!employee) return res.status(BAD_REQUEST).json({msg: "somethig went wrong!!"});

        res.status(OK).json({msg: employee}); 

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const getEmployees = async (req, res) => {
    try {
        const employee = await employeeDB.find();
        console.log(employee);
        if(!employee || employee.length < 1) return res.status(NOT_FOUND).json({msg: "no resource found!!"});
        
        res.status(OK).json({msg: employee});
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const getSingleEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await employeeDB.findById(id);
        if(!employee) return res.status(NOT_FOUND).json({msg: "no resource found!!"});
        
        res.status(OK).json({msg: employee});
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, title, gender, status } = req.body;
    if(!name || !title || !gender || !status) return res.status(BAD_REQUEST).json({msg: "missing fields"});

    try {
        const employee = await employeeDB.updateById(id, { name, title, gender, status });
        if(!employee) return res.status(NOT_FOUND).json({msg: "no resource found!!"});
        
        res.status(OK).json({msg: employee});
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await employeeDB.deleteById(id);
        if(!employee) return res.status(NOT_FOUND).json({msg: "no resource found!!"});
        
        res.status(OK).json({msg: employee});
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

module.exports = {
   addEmployee,
   getEmployees,
   deleteEmployee,
   updateEmployee,
   getSingleEmployee
}