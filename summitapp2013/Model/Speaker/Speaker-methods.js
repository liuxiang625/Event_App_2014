

model.Speaker.methods.updateSpeakerImagesFolder = function() {
	var dataImagesFolder = Folder(ds.getDataFolder().path + "images/speakerimages");
	var webImagesFolder = Folder(getFolder("path") + "WebFolder/images/speakerimages");
	dataImagesFolder.forEachFile(function(file) 
	{
		file.moveTo(webImagesFolder.path + file.name,true ); // store the file path
	});
	
	return true;
};
model.Speaker.methods.updateSpeakerImagesFolder.scope = "public";

model.Speaker.methods.getAllSpeakers = function() {
	var speakers = {};
	
	speakers.speakersArray = ds.Speaker.query("isStaff == null or isStaff == false").orderBy("firstName").toArray("ID,firstName,lastName,fullName,company,title,biography,picURL,linkedIn");
	speakers.staffArray = ds.Speaker.query("isStaff == true").orderBy("firstName").toArray("ID,firstName,lastName,fullName,company,title,biography,picURL,linkedIn");
	return speakers;
};

model.Speaker.methods.getAllSpeakers.scope = "public";