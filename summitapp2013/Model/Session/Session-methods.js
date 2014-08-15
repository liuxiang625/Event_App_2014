

model.Session.methods.getLiveSessions = function() {
	var date = new Date();
	 var sessions = {
		liveSessionsArray:[],
		commingSessions:[]
	}
	//var livesessions = ds.Session.query("startTime >= :1", date);
	//var liveSessions = ds.Session.query("startTime <= :1 and endTime >= :1", date).orderBy("sessionDateString, startTimeString");
	//var liveSessions = ds.Session.query("startTime >= :1", date).orderBy("sessionDateString, startTimeString");
	sessions.liveSessionsArray = ds.Session.query("startTime <= :1 and endTime >= :1", date).orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,speakers.fullName");

  	//sessions.commingSessionsArray = ds.Session.query("startTime <= :1 and endTime >= :1", new Date(date.setHours(date.getHours()+1))).orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,speakers.fullName");;
	sessions.commingSessionsArray = ds.Session.query("startTime >= :1", date).orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,speakers.fullName");
	return sessions
	//return livesessions.orderBy("sessionDateString, startTimeString");
	//	debugger;
};
model.Session.methods.getLiveSessions.scope = "public";

model.Session.methods.isSessionAlive = function() {
	var date = new Date();
	
	var isCurrent = false;
	
	ds.Session.query("startTime <= :1 and endTime >= :1", date).length > 0?isCurrent = true:isCurrent= false;

	return isCurrent
};
model.Session.methods.isSessionAlive.scope = "public";
