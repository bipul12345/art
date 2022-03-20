const express = require("express");
const Course = require('../models/course');
const auth = require('../auth');
const course = require("../models/course");

const router = express.Router();

router.route("/")
    .get((req, res, next) => {
        Course.find()
            .populate({
                path: 'owner'
            })
            .then((course) => {
                if (course == null) throw new Error("NO COURSES AVAILABLE!");
                res.json(course);
            })
            .catch(next)
    })
    .post(auth.verifyUser, (req, res, next) => {
        let course = new Course(req.body);
        course.owner = req.user._id;
        course.save()
            .then(course => {
                res.statusCode = 201;
                res.json(course);
            })
            .catch(next)
    })
    .put((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not set yet." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Course.deleteMany({ owner: req.user._id })
            .then(response => {
                console.log("Course doesn't belong to you!")
                res.json(response);
            })
            .catch(next);
    });

//MY COURSE
router.route("/myCourses")
    .get(auth.verifyUser, (req, res, next) => {
        Course.find({ owner: req.user._id })
            .populate({
                path: 'owner'
            })
            .then(course => {
                if (course == null) throw new Error("No course posted yet.");
                res.json(course);
            })
            .catch(next)
    })

//MY COURSE OPERATIONS
router.route("/:id")
    .get((req, res, next) => {
        Course.findOne({ _id: req.params.id })
            .populate({
                path: 'owner'
            })
            .then(course => {
                if (course == null) throw new Error("Course has been removed.");
                res.json(course);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .put(auth.verifyUser, (req, res, next) => {
        Course.findOneAndUpdate(
            { owner: req.user._id, _id: req.params.id },
            { $set: req.body },
            { new: true }
        )
            .populate({
                path: 'owner'
            })
            .then(reply => {
                if (reply == null) throw new Error("Sorry, property update failed.");
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Course.findOneAndDelete({ owner: req.user._id, _id: req.params.id })
            .populate({
                path: 'owner'
            })
            .then(response => {
                res.json(response);
            })
            .catch(next);
    });
module.exports = router;