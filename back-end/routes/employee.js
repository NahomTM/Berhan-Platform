const express = require('express');
const {addEmployee, fetchAllEmployees, updateEmployee, deleteEmployee} = require('../controllers/employee')

const router = express.Router();

router.post('/addEmployee', addEmployee)
router.get('/getAllEmployee', fetchAllEmployees)
router.put('/updateEmployee/:id', updateEmployee)
router.delete('/deleteEmployee/:id', deleteEmployee)


module.exports = router