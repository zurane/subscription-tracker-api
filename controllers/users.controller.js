import User from "../models/user.model.js";

// Controller to find and return all users
const findUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to find and return a user by ID
const findUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password field

    if (!user) {
      // If user not found, throw 404 error
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update a user by ID
const updateUserById = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      // If user not found, throw 404 error in case you try to update a non-existing user
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete a user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { findUsers, findUserById, updateUserById, deleteUserById };
