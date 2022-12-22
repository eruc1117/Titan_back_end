const User = require("../class/user");

const checkInController = {
  checkIn: async (req, res) => {
    const id = req.body.userId;
    const location = req.body.location;
    const empoloyee = new User(id);
    const testResult = await empoloyee.userGpsPunch(location);
    console.log(testResult[0][0]);
    res.send("Sucess");
  },
};

module.exports = checkInController;
