console.clear();
import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import {
  loginRules,
  registerRules,
  validation,
} from "../middleware/validator.js";

const router = express.Router();

// post method
// register
router.post("/new", registerRules(), validation, async (req, res) => {
  const { username, age, email, password } = req.body;
  try {
    const mailexist = await User.findOne({ email });
    const pseudoexist = await User.findOne({ username });
    if (mailexist || pseudoexist) {
      return res.status(500).send({ msg: "email or username already exist" });
    }

    // hashing password
    const salt = 10;
    const gensalt = await bcrypt.genSalt(salt);
    const hashedpassword = await bcrypt.hash(password, gensalt);
    // end
    const newUser = new User({ username, age, email, password });
    newUser.password = hashedpassword;
    await newUser.save();
    res.status(200).send({ msg: "register success ", response: newUser });
  } catch (error) {
    res.status(500).send({ msg: "register failed", response: error });
    console.log(error);
  }
});

// login
router.post("/login", loginRules(), validation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const findedemail = await User.findOne({ email });
    const findedpassword = await bcrypt.compare(findedemail.password, password);

    if (!findedemail) {
      res.status(500).send({ msg: "bad credential" });
    }

    if (!findedpassword) {
      res.status(500).send({ msg: "bad credential" });
    }

    res.status(200).send({ msg: "succes login", response: findedemail });
  } catch (error) {
    res.status(500).send({ msg: "login failed" });
  }
});

// end post

// get method

router.get("/users", async (req, res) => {
  try {
    const all = await User.find();
    res.status(200).send({ msg: "all users : ", response: all });
  } catch (error) {
    res.status(500).send({ msg: "failed", error });
  }
});
// end of get

// delete method
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.deleteOne({ _id: req.params.id });
    deleted.deletedCount
      ? res.status(200).send({ msg: "deleted successfully", response: deleted })
      : res.status(200).send({ msg: "already deleted" });
  } catch (error) {
    res.status(500).send({ msg: "failed delete", response: error });
  }
});
// end of delete

// update method
router.patch("/:id", async (req, res) => {
  try {
    const updated = await User.updateOne({
      _id: req.params.id,
      $set: { ...req.body },
    });
    updated.modifiedCount
      ? res.status(200).send({ msg: "updated successfully", response: updated })
      : res.status(200).send({ msg: "already updated " });
  } catch (error) {
    res.status(500).send({ msg: "failed delete", response: error });
  }
});

// end of update

export default router;
