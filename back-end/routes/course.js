const express = require('express');
const {addCourse, getCourses, updateCourse, deleteCourse} = require('../controllers/course')

const router = express.Router();

router.post('/newCourse', addCourse)
router.get('/getCourses', getCourses)
router.put('/updateCourse/:id', updateCourse)
router.delete('/deleteCourse/:id', deleteCourse)

module.exports = router