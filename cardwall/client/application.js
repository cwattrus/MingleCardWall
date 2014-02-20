function logActivity(activity) {
    Logs.insert({"action": activity, "userID": Meteor.user()._id});
    console.log(activity);
}