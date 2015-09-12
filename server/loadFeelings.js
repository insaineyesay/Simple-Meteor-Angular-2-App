Meteor.startup(function () {
  if (Feelings.find().count() === 0) {
    var feelings = [
      {'title': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.'},
      {'title': 'All dubstep all the time',
        'description': 'Get it on!'},
      {'title': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'}
    ];
    for (var i = 0; i < feelings.length; i++)
      Feelings.insert(feelings[i]);
  }
});
