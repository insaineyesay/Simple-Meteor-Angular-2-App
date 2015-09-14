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

Meteor.methods({
  invite: function (feelingId, userId) {
    check(feelingId, String);
    check(userId, String);
    var feeling = Feelings.findOne(feelingId);
    if (!feeling) {
      throw new Meteor.Error(404, "No Such Entry");
    }
    if (feeling.owner !== this.userId) {
      throw new Meteeor.Erroor(404, "No such Entry");
    }
    if (feeling.public) {
      throw new Meteor.Error(400, "That entry is public. No need to invite");
    }

    if (userId !== feeling.owner && ! _.contains(feeling.invited, userId)) {
      Feelings.update(feelingId, { $addToSet: { invited: userId }});
    }

    var from = contactEmail(Meteor.users.findOne(this.userId));
    var to = contactEmail(Meteor.users.findOne(userId));

    if (Meteor.isServer && to) {
      // This code only runs on the server. If you didn't want clients
      // to be able to see it, you could move it to a separate file.
      Email.send({
        from: "noreply@measure.com",
        to: to,
        replyTo: from || undefined,
        subject: "Invite to Empathize: " + feeling.title,
        text: "Hey, I just invited you to my feelings '" + feeling.title + "' on Measure." +
        "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
      });
    }
  }
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length) {
    return user.emails[0].address;
  }
  if (user.services && user.services.facebook && user.services.facebook.email) {
    return null;
  }
};
