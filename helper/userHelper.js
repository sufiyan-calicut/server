import bcrypt from "bcrypt";
import userModel from "../model/user.js";

export const userStore = (user) => {
  return new Promise(async (resolve, reject) => {
    const newUser = new userModel(user);
    const saltRounds = 10;

    bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  });
};

// ----------------------------------------------------------------LOGIN-------------------------------------------------------------------//

export const doLogin = (user, userDatabase) => {
  return new Promise(async (resolve, reject) => {
    const password = user.password;
    const realPassword = userDatabase.password;
    const passwordMatch = await bcrypt.compare(password, realPassword);
    if (passwordMatch) {
      const userData = {
        userId: userDatabase._id,
        email: userDatabase.email,
      };
      resolve(userData);
    } else {
      resolve(false);
    }
  });
};

// ----------------------------------------------------------------RESET PASSWORD-------------------------------------------------------------------//

export const resetPasswordHelper = (userEmail, password) => {
  return new Promise(async (resolve, reject) => {
    const saltRound = 10;
    const newPassword = await bcrypt.hash(password, saltRound);
    const passwordUpdate = await userModel.updateOne(
      { email: userEmail },
      { password: newPassword }
    );
    if (passwordUpdate) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
