import bcrypt from "bcrypt";
import requestModel from "../model/request.js";
import driverModel from "../model/driver.js";

// ----------------------------------------------------------------STORE DOCTOR-------------------------------------------------------------------//

export const driverStore = async ({ driver, license }) => {
  return new Promise((resolve, reject) => {
    const newDriver = new requestModel(driver);
    const saltRounds = 10;
    bcrypt.hash(newDriver.password, saltRounds, (err, hash) => {
      if (err) throw err;
      newDriver.password = hash;
      newDriver.license = license;
      newDriver
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

// ----------------------------------------------------------------DO LOGIN-------------------------------------------------------------------//

export const doLogin = async (driver, driverDatabase) => {
  return new Promise(async (resolve, reject) => {
    const password = driver.password;
    const realPassword = driverDatabase.password;
    const passwordMatch = await bcrypt.compare(password, realPassword);
    if (passwordMatch) {
      const driverData = {
        driverId: driverDatabase._id,
        email: driverDatabase.email,
      };
      resolve(driverData);
    } else {
      resolve(false);
    }
  });
};

// ----------------------------------------------------------------RESET PASSWORD-------------------------------------------------------------------//

export const resetPasswordHelperDriver = (driverEmail, password) => {
  return new Promise(async (resolve, reject) => {
    const saltRound = 10;
    const newPassword = await bcrypt.hash(password, saltRound);
    const passwordUpdate = await driverModel.updateOne(
      { email: driverEmail },
      { password: newPassword }
    );
    if (passwordUpdate) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
