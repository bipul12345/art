const express = require("express");

const Query = require("../models/query");
const auth = require("../auth");
const router = express.Router();

router.route("/")
    .get((req, res, next) => {
        Query.find()

            .populate({
                path: 'askedBy'
            })
            .then((query) => {
                if (query == null) throw new Error("No queries yet!");
                res.json(query);
            }).catch(next)
    })
    .post(auth.verifyUser, (req, res, next) => {
        let query = new Query(req.body);
        query.save()
            .then(query => {
                res.statusCode = 201;
                res.json(query);
            })
            .catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Query.deleteMany()
            .then(response => {
                console.log("All queries deleted.")
                res.json(response);
            })
            .catch(next);
    })

//SPECIFIC ENROLLMENT

router.route("/:id")
    .get((req, res, next) => {
        Query.findOne({ _id: req.params.id })

            .populate({
                path: 'askedBy'
            })
            .then(query => {
                if (query == null) throw new Error("Query not available.");
                res.json(query);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })

    .put(auth.verifyUser, (req, res, next) => {
        Query.findOneAndUpdate({ _id: req.params.id, askedBy: req.user._id },
            { $set: req.body }, { new: true })
            .then(reply => {
                if (reply == null) throw new Error("Sorry! query couldn't updated.");
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Query.findOneAndDelete({ _id: req.params.id, askedBy: req.user._id })
            .then(response => {
                console.log("Query deleted successfully.")
                res.json(response);
            })
            .catch(next);
    })
module.exports = router;