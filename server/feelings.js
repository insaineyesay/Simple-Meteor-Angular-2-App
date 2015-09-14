Meteor.publish('feelings', function (options, searchString) {
  if (searchString == null) {
    searchString = '';
  }
  Counts.publish(this, 'numberOfFeelings', Feelings.find({
    'title' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or: [
      {$and: [
        {'public': true},
        {'public': {$exists: true}}
      ]},
      {$and: [
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and: [
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}), { noReady: true });

  return Feelings.find({
    'title' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or: [
      {$and: [
        {'public': true},
        {'public': {$exists: true}}
      ]},
      {$and: [
        {owner: this.userId},
        {owner: {$exists: true}}
      ]},
      {$and: [
        {invited: this.userId},
        {invited: {$exists: true}}
      ]}
    ]}, options);
});
