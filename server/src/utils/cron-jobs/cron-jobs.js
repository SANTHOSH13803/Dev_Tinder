const cron = require("node-cron");
const User = require("../../models/user");
const { subDays } = require("date-fns");
const ConnectionRequestModel = require("../../models/connectionRequest");
const { sendEmail } = require("../sendEmail");
const { generateDailySummaryEmail } = require("./dialySummaryTemplate");
cron.schedule("0 8 * * *", async () => {
  try {
    const users = await User.find();

    const presentDate = Date.now();
    const yesterday = subDays(presentDate, 1);

    for (let user of users) {
      const receivedConnectionRequest =
        await ConnectionRequestModel.countDocuments({
          toUserId: user?._id,
          status: "interested",
          createdAt: { $gte: yesterday, $lt: presentDate }
        });

      const acceptedConnectionRequests =
        await ConnectionRequestModel.countDocuments({
          toUserId: user?._id,
          status: "accepted",
          createdAt: { $gte: yesterday, $lt: presentDate }
        });
      const sentConnectionRequests =
        await ConnectionRequestModel.countDocuments({
          fromUserId: user?._id,
          createdAt: { $gte: yesterday, $lt: presentDate }
        });
      if (
        [
          receivedConnectionRequest,
          acceptedConnectionRequests,
          sentConnectionRequests
        ].some((each) => each > 0)
      ) {
        const html = generateDailySummaryEmail({
          firstName: user.firstName,
          receivedRequests: receivedConnectionRequest,
          acceptedRequests: acceptedConnectionRequests,
          sentRequests: sentConnectionRequests
        });
        await sendEmail({
          to: user.emailId,
          subject: "Last Day Summary",
          html: html
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});
