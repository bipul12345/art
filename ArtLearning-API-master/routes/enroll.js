const express = require("express");

const Enroll = require("../models/enroll");
const auth = require("../auth");
const router = express.Router();

router.route("/")
    .get(auth.verifyUser, (req, res, next) => {
        Enroll.find()
            .populate({
                path: 'course'
            })
            .populate({
                path: 'student'
            })
            .then((enroll) => {
                if (enroll == null) throw new Error("No enrollment request yet!");
                res.json(enroll);
            }).catch(next)
    })
    .post(auth.verifyUser, (req, res, next) => {
        let enroll = new Enroll(req.body);
        enroll.save()
            .then(enroll => {
                res.statusCode = 201;
                res.json(enroll);
            })
            .catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Enroll.deleteMany()
            .then(response => {
                console.log("All enrollment deleted.")
                res.json(response);
            })
            .catch(next);
    })

//MY ENROLLMENT

router.route("/myEnrollment")
    .get(auth.verifyUser, (req, res, next) => {
        Enroll.find({ student: req.user._id })
            .populate({
                path: 'course'
            })
            .then((cart) => {
                if (cart == null) throw new Error("No products had been added to cart.");
                res.json(cart);
            }).catch(next)
    })

//SPECIFIC ENROLLMENT

router.route("/:id")
    .get((req, res, next) => {
        Enroll.findOne({ _id: req.params.id })
            .populate({
                path: 'course'
            })
            .populate({
                path: 'student'
            })
            .then(enroll => {
                if (enroll == null) throw new Error("Enrollment not available.");
                res.json(enroll);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })

    .put((req, res, next) => {
        Enroll.findOneAndUpdate({ _id: req.params.id },
            { $set: req.body }, { new: true })
            .then(reply => {
                if (reply == null) throw new Error("Sorry! enrollment couldn't approved.");
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Enroll.findOneAndDelete({ _id: req.params.id })
            .then(response => {
                console.log("Enrollment deleted successfully.")
                res.json(response);
            })
            .catch(next);
    })

//SPECIFIC ENROLLMENT
router.route("/enrollmentOf/:cid")
    .get((req, res, next) => {
        Enroll.find({ course: req.params.cid })
            .populate({
                path: 'course'
            })
            .populate({
                path: 'student'
            })
            .then(resource => {
                if (resource == null) throw new Error("Enrollment not available.");
                res.json(resource);
            })
            .catch(next);
    });

module.exports = router;