const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// @desc    Get courses
// @route   Get /api/v1/courses
// @route   Get /api/v1/bootcamps/:bootcampId/courses
// @access  Public

// exports.getCourses = asyncHandler(async (req, res, next) => {
//   let query;

//   if (req.params.bootcampId) {
//     query = Course.find({ bootcamp: req.params.bootcampId });
//   } else {
//     query = Course.find();
//   }

//   const courses = await query;

//   res.status(200).json({
//     success: true,
//     count: courses.length,
//     data: courses,
//   });
// });

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    console.log("Bootcamp ID:", req.params.bootcampId);

    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  console.log("Courses found:", courses);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
