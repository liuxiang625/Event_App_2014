//ds.Session.query("sessionDateString begin :1",'*', {
//						//orderBy:"sessionDateString, startTimeString", //ID
//});


//ds.Session.query("title =:1",'*').orderBy('sessionDateString',);
						//orderBy:"title" 
						//, sessionDateSting", //ID
//});

//var result;
//result= [];

//var attribute = 'startTimeString';
//  var attribute = 'endTimeString';
/*
ds.Session.all().forEach(function (session) {
	var
		time,
		timeArray,
		item;

	time = session[attribute];

	item = [session.ID, time];
	if (time.indexOf('PM') > -1) {
		timeArray = time.split(':');
		if (timeArray[0] !== '12') {
			timeArray[0] = parseInt(timeArray[0], 10) + 12;
			time = timeArray.join(':');
		}
	}
	time = time.substr(0, time.length - 2);
	item.push(time);
	result.push(item)
	if (item[1].indexOf('M') > -1) {
		session[attribute] = time;
	}
	if (time.length < 5) {
	    session[attribute] = "0" + time;
	}
})
*/
//ds.Session.query('sessionDateString > "11/11"').orderBy('sessionDateString,startTimeString').toArray('ID,title,sessionDateString,startTimeString');

