Meteor.publish("cards", function () {
  return Cards.find({owner: this.userId});
});
Meteor.publish("beta", function () {
  return Beta.find({owner: this.userId});
});
Meteor.publish("logs", function () {
  return Logs.find({owner: this.userId});
});