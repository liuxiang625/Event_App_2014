
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button24 = {};	// @button
	var button23 = {};	// @button
	var button22 = {};	// @button
	var button12 = {};	// @button
	var button8 = {};	// @button
	var button7 = {};	// @button
	var button6 = {};	// @button
	var button5 = {};	// @button
	var dataGrid8 = {};	// @dataGrid
	var menuItem10 = {};	// @menuItem
	var button11 = {};	// @button
	var menuItem3 = {};	// @menuItem
	var fileUpload2 = {};	// @fileUpload
	var button18 = {};	// @button
	var button17 = {};	// @button
	var dataGrid3 = {};	// @dataGrid
	var button10 = {};	// @button
	var button9 = {};	// @button
	var menuItem1 = {};	// @menuItem
	var menuItem2 = {};	// @menuItem
	var button1 = {};	// @button
	var documentEvent = {};	// @document
	var button3 = {};	// @button
	var button4 = {};	// @button
	var button2 = {};	// @button
	var dataGrid2 = {};	// @dataGrid
// @endregion// @endlock

// eventHandlers// @lock

	button24.click = function button24_click (event)// @startlock
	{// @endlock
		var deleteOK = confirm('Are you sure to delete: ' + sources.evalQuestion.questionText +"?");
		if(deleteOK)sources.evalQuestion.removeCurrent();
	};// @lock

	button23.click = function button23_click (event)// @startlock
	{// @endlock
		sources.evalQuestion.addNewElement();
		sources.evalQuestion.serverRefresh();
	};// @lock

	button22.click = function button22_click (event)// @startlock
	{// @endlock
		sources.evalQuestion.save();
	};// @lock

	button12.click = function button12_click (event)// @startlock
	{// @endlock
		var deleteOK = confirm('Are you sure to delete: ' + sources.presentation.sessionName + ", speaker: " + sources.presentation.speakerName +"?");
		if(deleteOK)sources.presentation.removeCurrent();
	};// @lock

	button8.click = function button8_click (event)// @startlock
	{// @endlock
		var deleteOK = confirm('Are you sure to delete: ' + sources.speaker.fullName);
		if(deleteOK)sources.session.removeCurrent();
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		var deleteOK = confirm('Are you sure to delete: ' + sources.session.title);
		if(deleteOK)sources.session.removeCurrent();
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		sources.presentation.addNewElement();
		sources.presentation.serverRefresh();
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		sources.presentation.session.set(sources.breakoutSessions);
		sources.presentation.speaker.set(sources.speakersOnly);
		sources.presentation.save();
	};// @lock

	dataGrid8.onRowClick = function dataGrid8_onRowClick (event)// @startlock
	{// @endlock
		sources.breakoutSessions.selectByKey(sources.presentation.sessionID);
		sources.speakersOnly.selectByKey(sources.presentation.speakerID);

	};// @lock

	menuItem10.click = function menuItem10_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(5);
		$$('menuItem1').setState('default');
		sources.presentation.all();
	};// @lock

	button11.click = function button11_click (event)// @startlock
	{// @endlock
//		WAF.directory.loginByPassword($$('adminName').getValue(),$$('adminPwd').getValue());
		WAF.directory.loginByPassword($$('adminName').getValue(),$$('adminPwd').getValue(), {
		    onSuccess: function(event){
		        if(event.result == true){            
					$$('loginContainer').hide();
					
		        } else {
		            return {error: 101, errorMessage: "Incorrect login credentials."};
		            }
		        },
		    onError: function(event){
		        return {error: 100, errorMessage: "Failed to communicate with server."};
		    }
		});
	};// @lock

	menuItem3.click = function menuItem3_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(6);
		$$('menuItem1').setState('default');
	};// @lock

	fileUpload2.filesUploaded = function fileUpload2_filesUploaded (event)// @startlock
	{// @endlock
		var fileName = event.response[0].filename;
		sources.speaker.updateSpeakerImagesFolder({
	        onSuccess: function(updateImagesFolderevent) {
	        	if(updateImagesFolderevent.result) {
	          		sources.speaker.picURL = fileName;
	          		$('#image1 img')[0].src = "http://127.0.0.1:8081/images/speakerimages/" + source.speaker.picURL;
	          	}
	        }
    	});
	};// @lock

	button18.click = function button18_click (event)// @startlock
	{// @endlock
		if(sources.speaker.isNewElement()){
			sources.speaker.removeCurrentReference({
		        onSuccess: function(event) {
		           $$('tabView2').selectTab(3);
		        }
	    	});
	    }
	    else
	    sources.speaker.serverRefresh({
		        onSuccess: function(event) {
		           $$('tabView2').selectTab(3);
		        }
	    });
	};// @lock

	button17.click = function button17_click (event)// @startlock
	{// @endlock
		//Save Speaker Detail
		sources.speaker.fullName = sources.speaker.firstName + " " + sources.speaker.lastName;
		sources.speaker.save({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(3);
	        }
    	});
	};// @lock

	dataGrid3.onRowDblClick = function dataGrid3_onRowDblClick (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(4);
		$('#image1 img')[0].src = "http://127.0.0.1:8081/images/speakerimages/" + source.speaker.picURL;
	};// @lock

	button10.click = function button10_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(4);
	};// @lock

	button9.click = function button9_click (event)// @startlock
	{// @endlock
		sources.speaker.addNewElement();
		sources.speaker.serverRefresh();
		$$('tabView2').selectTab(4);
	};// @lock

	menuItem1.click = function menuItem1_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(1);
		sources.session.all();
	};// @lock

	menuItem2.click = function menuItem2_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(3);
		$$('menuItem1').setState('default');
		sources.speaker.all();
	};// @lock
	
	button1.click = function button1_click (event)// @startlock
	{// @endlock
		sources.session.addNewElement();
		sources.session.serverRefresh();
		$$('tabView2').selectTab(2);
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$$('menuItem1').setState('active');
		if (waf.directory.currentUserBelongsTo('admin') == 1)
		$$('loginContainer').hide();
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		//Save Session Details
		var sessionDate = sources.session.sessionDate;
		sources.session.sessionDateString = sessionDate.getMonth()+1 + "/" + sessionDate.getDate() + "/" + sessionDate.getFullYear();
		sources.session.endTime = new Date(sources.session.sessionDate.toDateString() + " " + sources.session.endTimeString);
		sources.session.startTime = new Date(sources.session.sessionDate.toDateString() + " " + sources.session.startTimeString);
		sources.session.save({
	        onSuccess: function(event) {
	           $$('tabView2').selectTab(1);
	        }
    	});
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		if(sources.session.isNewElement()){
			sources.session.removeCurrent({
		        onSuccess: function(event) {
		           $$('tabView2').selectTab(1);
		        }
	    	});
	    }
	    else
	     sources.session.serverRefresh({
		        onSuccess: function(event) {
		           $$('tabView2').selectTab(1);
		        }
	    });
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);
	};// @lock

	dataGrid2.onRowDblClick = function dataGrid2_onRowDblClick (event)// @startlock
	{// @endlock
		$$('tabView2').selectTab(2);

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button24", "click", button24.click, "WAF");
	WAF.addListener("button23", "click", button23.click, "WAF");
	WAF.addListener("button22", "click", button22.click, "WAF");
	WAF.addListener("button12", "click", button12.click, "WAF");
	WAF.addListener("button8", "click", button8.click, "WAF");
	WAF.addListener("button7", "click", button7.click, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("dataGrid8", "onRowClick", dataGrid8.onRowClick, "WAF");
	WAF.addListener("menuItem10", "click", menuItem10.click, "WAF");
	WAF.addListener("button11", "click", button11.click, "WAF");
	WAF.addListener("menuItem3", "click", menuItem3.click, "WAF");
	WAF.addListener("fileUpload2", "filesUploaded", fileUpload2.filesUploaded, "WAF");
	WAF.addListener("button18", "click", button18.click, "WAF");
	WAF.addListener("button17", "click", button17.click, "WAF");
	WAF.addListener("dataGrid3", "onRowDblClick", dataGrid3.onRowDblClick, "WAF");
	WAF.addListener("button10", "click", button10.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("menuItem1", "click", menuItem1.click, "WAF");
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("dataGrid2", "onRowDblClick", dataGrid2.onRowDblClick, "WAF");
// @endregion
};// @endlock
