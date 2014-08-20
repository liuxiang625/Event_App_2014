

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