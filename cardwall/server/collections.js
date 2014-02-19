Meteor.publish("cards", function () {
  return Cards.find({owner: this.userId});
});
