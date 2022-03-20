const express = require("express");

const Answer = require("../models/answer");
const auth = require("../auth");
const router = express.Router();

router.route("/")
    .get((req, res, next) => {
        Answer.find()
            .populate({
                path: 'query'
            })
            .populate({
                path: 'answeredBy'
            })
            .then((answer) => {
                if (answer == null) throw new Error("No replies yet!");
                res.json(answer);
            }).catch(next)
    })
    .post(auth.verifyUser, (req, res, next) => {
        let answer = new Answer(req.body);
        answer.save()
            .then(answer => {
                res.statusCode = 201;
                res.json(answer);
            })
            .catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Answer.deleteMany()
            .then(response => {
                console.log("All replies has been deleted.")
                res.json(response);
            })
            .catch(next);
    })

//SPECIFIC Answer
router.route('/viewRepliesOf/:qid')
    .get(auth.verifyUser, (req, res, next) => {
        Answer.find({ query: req.params.qid })
            .populate({
                path: 'query'
            })
            .populate({
                path: 'answeredBy'
            })
            .then(answer => {
                if (answer == null) throw new Error("Reply not available.");
                res.json(answer);
            })
            .catch(next);
    })

router.route("/:id")
    .get((req, res, next) => {
        Answer.findOne({ _id: req.params.id })
            .populate({
                path: 'query'
            })
            .populate({
                path: 'answeredBy'
            })
            .then(answer => {
                if (answer == null) throw new Error("Reply not available.");
                res.json(answer);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })

    .put(auth.verifyUser, (req, res, next) => {
        Answer.findOneAndUpdate({ _id: req.params.id, answeredBy: req.user._id },
            { $set: req.body }, { new: true })
            .then(reply => {
                if (reply == null) throw new Error("Sorry! reply couldn't updated.");
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Answer.findOneAndDelete({ _id: req.params.id, answeredBy: req.user._id })
            .then(response => {
                console.log("Reply deleted successfully.")
                res.json(response);
            })
            .catch(next);
    })
module.exports = router;