Meteor.publish('feelings', function (options) {
  Counts.publish(this, 'numberOfFeelings', Feelings.find({
    $or: [
      {$and: [
        {'public': true},
        {'public': {$exists: true}}
      ]},
      {$and: [
        {owner: this.userId},
        {owner: {$exists: true}}
      ]}
    ]}), { noReady: true });

  return Feelings.find({
    $or: [
      {$and: [
        {'public': true},
        {'public': {$exists: true}}
      ]},
      {$and: [
        {owner: this.userId},
        {owner: {$exists: true}}
      ]}
    ]}, options);
});
