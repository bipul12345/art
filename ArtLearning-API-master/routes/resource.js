const express = require("express");

const Resource = require("../models/resource");
const auth = require("../auth");
const router = express.Router();

router.route("/")
    .get(auth.verifyUser, (req, res, next) => {
        Resource.find()
            .populate({
                path: 'course'
            })
            .then((resource) => {
                if (resource == null) throw new Error("No resource added to this course!");
                res.json(resource);
            }).catch(next)
    })
    .post(auth.verifyUser, (req, res, next) => {
        let resource = new Resource(req.body);
        resource.save()
            .then(resource => {
                res.statusCode = 201;
                res.json(resource);
            })
            .catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Resource.deleteMany()
            .then(response => {
                console.log("All resource has been deleted.")
                res.json(response);
            })
            .catch(next);
    })

//SPECIFIC ENROLLMENT

router.route("/:id")
    .get((req, res, next) => {
        Resource.findOne({ _id: req.params.id })
            .populate({
                path: 'course'
            })

            .then(resource => {
                if (resource == null) throw new Error("Resource not available.");
                res.json(resource);
            })
            .catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })

    .put(auth.verifyUser, (req, res, next) => {
        Resource.findOneAndUpdate({ _id: req.params.id },
            { $set: req.body }, { new: true })
            .then(reply => {
                if (reply == null) throw new Error("Sorry! resource couldn't updated.");
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Resource.findOneAndDelete({ _id: req.params.id })
            .then(response => {
                console.log("resource deleted successfully.")
                res.json(response);
            })
            .catch(next);
    })

//GETTING RESOURCES OF SPECIFIC COURSE
router.route("/resourceOf/:cid")
    .get((req, res, next) => {
        Resource.find({ course: req.params.cid })
            .populate({
                path: 'course'
            })
            .then(resource => {
                if (resource == null) throw new Error("Resource not available.");
                res.json(resource);
            })
            .catch(next);
    })
module.exports = router;