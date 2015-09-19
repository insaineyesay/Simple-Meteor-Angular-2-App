// Mongo Collection
Feelings = new Mongo.Collection("feelings");

Feelings.allow({
    insert: function(userId, feeling) {
        return userId && feeling.owner === userId;
    },
    update: function(userId, feeling, fields, modifier) {
        return userId && feeling.owner === userId;
    },
    remove: function(userId, feeling) {
        return userId && feeling.owner === userId;
    }
});

Meteor.methods({
    invite: function(feelingId, userId) {
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

        if (userId !== feeling.owner && !_.contains(feeling.invited, userId)) {
            Feelings.update(feelingId, {
                $addToSet: {
                    invited: userId
                }
            });


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
    },
    rsvp: function (feelingId, rsvp) {
        check(feelingId, String);
        check(rsvp, String);
        if (!this.userId)
            throw new Meteor.Error(403, "You must be logged in to RSVP");
        
        if (!_.contains(['yes', 'no', 'maybe'], rsvp))
            throw new Meteor.Error(400, "Invalid RSVP");
            var feeling = Feelings.findOne(feelingId);
        
        if (!feeling)
            throw new Meteor.Error(404, "No Such Entry");
        if (!feeling.public && feeling.owner !== this.userId && !_.contains(feeling.invited, this.userId))
            throw new Meteor.Error(403, "No such Entry");

        var rsvpIndex = _.indexOf(_.pluck(feeling.rsvps, 'user'), this.userId);
        if (rsvpIndex !== -1) {
            if (Meteor.isServer) {
                Feelings.update({
                    _id: feelingId,
                    "rsvps.user": this.userId
                }, {
                    $set: {
                        "rsvps.$.rsvp": rsvp
                    }
                });
            } else {
                // minimongo doesn't yet support $ in modifier. as a temporary
                // workaround, make a modifier that uses an index. this is
                // safe on the client since there's only one thread.
                var modifier = {
                    $set: {}
                };
                modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
                Feelings.update(feelingId, modifier);
            }
            // Possible improvement: send email to the other people that are
            // coming to the party.
        } else {
            // add new rsvp entry
            Feelings.update(feelingId, {
                $push: {
                    rsvps: {
                        user: this.userId,
                        rsvp: rsvp
                    }
                }
            });
        }
    }
});

var contactEmail = function(user) {
    if (user.emails && user.emails.length) {
        return user.emails[0].address;
    }
    if (user.services && user.services.facebook && user.services.facebook.email) {
        return null;
    }
};