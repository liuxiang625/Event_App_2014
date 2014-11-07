

model.Session.methods.getLiveSessions = function(conferenceID) {
	var CESTDate = getOffsetDate(60);//Paris CEST time
	var sessions = {};
	sessions.liveSessionsArray = ds.Session.query("startTime <= :1 and endTime >= :1", CESTDate).orderBy("sessionDateString, startTimeString").toArray("ID,title,title_FR,isActivity,room,room_FR,startTimeString,endTimeString,sessionDateString,speakers.fullName");
	sessions.allSessionsArray = ds.Session.query('conference.ID = :1', conferenceID).orderBy("sessionDateString, startTimeString").toArray("ID,title,,title_FR,isActivity,room,room_FR,startTimeString,endTimeString,description,description_FR,sessionDateString,speakers.fullName,speakers.ID");

	sessions.commingSessionsArray = ds.Session.query("startTime >= :1", CESTDate).orderBy("sessionDateString, startTimeString").toArray("ID,title,title_FR,isActivity,room,room_FR,startTimeString,endTimeString,sessionDateString,speakers.fullName");
	return sessions
};
model.Session.methods.getLiveSessions.scope = "public";

//Check if session has not yet taken place
model.Session.methods.isSessionAlive = function(sessionId) {
	var CESTDate = getOffsetDate(60);//Paris CEST time
	
	var isCurrent = false;
	ds.Session.query("startTime <= :1  and ID = :2", CESTDate,sessionId).length > 0?isCurrent = true:isCurrent= false;

	return isCurrent
};
model.Session.methods.isSessionAlive.scope = "public";

model.Session.methods.getServerTimezone = function() {
	return (new Date()).getTimezoneOffset();
};
model.Session.methods.getServerTimezone.scope = "public";

//Ultility change server timezone
function getOffsetDate(offsetInMintues) {
  // Get local date object
  var d = new Date();
  // Add local time zone offset to get UTC and 
  // Subtract offset to get desired zone
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - offsetInMintues);
  return d;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}