// Mongo Collection
Feelings = new Mongo.Collection("feelings");

Feelings.allow({
  insert: function (userId, feeling) {
    return userId && feeling.owner === userId;
  },
  update: function (userId, feeling, fields, modifier) {
    return userId && feeling.owner === userId;
  },
  remove: function (userId, feeling) {
    return userId && feeling.owner === userId;
  }
});
