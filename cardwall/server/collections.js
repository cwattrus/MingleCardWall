Meteor.publish("cards", function () {
  return Cards.find({owner: this.userId});
});
Meteor.publish("beta", function () {
  return Beta.find({owner: this.userId});
});