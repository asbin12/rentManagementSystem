// const userModel = require("../models/userModel");

// // login callback
// const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email, password });
//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }
//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error,
//     });
//   }
// };

// //Register Callback
// const registerController = async (req, res) => {
//   try {
//     const newUser = new userModel(req.body);
//     await newUser.save();
//     res.status(201).json({
//       success: true,
//       newUser,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error,
//     });
//   }
// };

// module.exports = { loginController, registerController };

const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Login Callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid Password");
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// Register Callback

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user with the hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// const registerController = async (req, res) => {
//   try {
//     // Validate the request body using Joi
//     const { error } = userValidation.validate(req.body);

//     if (error) {
//       // If validation fails, send a 400 Bad Request response with validation errors
//       return res
//         .status(400)
//         .json({ success: false, error: error.details[0].message });
//     }

//     const { name, email, password } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

//     // Create a new user with the hashed password
//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     res.status(201).json({
//       success: true,
//       newUser,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//     });
//   }
// };
module.exports = { loginController, registerController };
