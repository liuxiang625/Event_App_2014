

model.Session.methods.getLiveSessions = function() {
	var date = new Date();
	 var sessions = {};
	sessions.liveSessionsArray = ds.Session.query("startTime <= :1 and endTime >= :1", date).orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,speakers.fullName");
	sessions.allSessionsArray = ds.Session.all().orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,description,speakers.fullName,speakers.ID");

	sessions.commingSessionsArray = ds.Session.query("startTime >= :1", date).orderBy("sessionDateString, startTimeString").toArray("ID,title,isActivity,room,startTimeString,endTimeString,sessionDateString,speakers.fullName");
	return sessions
};
model.Session.methods.getLiveSessions.scope = "public";

//Check if session has not yet taken place
model.Session.methods.isSessionAlive = function(sessionId) {
	var date = new Date();
	
	var isCurrent = false;
	ds.Session.query("startTime <= :1  and ID = :2", date,sessionId).length > 0?isCurrent = true:isCurrent= false;

	return isCurrent
};
model.Session.methods.isSessionAlive.scope = "public";
