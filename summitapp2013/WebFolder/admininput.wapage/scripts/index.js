
WAF.onAfterInit = function onAfterInit() {// @lock
	
// @region namespaceDeclaration// @startlock
	var button3 = {};	// @button
	var imageButton1 = {};	// @buttonImage
	var button2 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		if(attendeeObj.email)
		sources.attendee1.query("email = :1", attendeeObj.email,{
	        onSuccess: function(){
				if(sources.attendee1.length == 0 ) {
					sources.attendee.addNewElement();
					sources.attendee.serverRefresh({
						onSuccess: function(event) {
							sources.attendee.fullName = attendeeObj.name;
							sources.attendee.email = attendeeObj.email;
							sources.attendee.save({
								onSuccess: function(){
									sources.answers.attendee.set(sources.attendee);
									sources.answers.survey.set(sources.survey);
									sources.answers.save();
									$$('button1').hide();
									$$('button2').hide();
									console.log("answer saved");
								},
								onError: function(error){
								}
							});
						},
						onError: function(error){
								
						}
					});
				}
				else {
				sources.answers.attendee.set(sources.attendee1);
				sources.answers.survey.set(sources.survey);
				sources.answers.save();
				$$('button1').hide();
				$$('button2').hide();
				console.log("answer saved");
				}
	    	}
        });
		
		
	};// @lock

	imageButton1.click = function imageButton1_click (event)// @startlock
	{// @endlock
		source.answers.addNewElement();
		
		//Init radio button group valuee;
		attendeeObj = {
			name:'',
			email:'',
			anynomous:'false'
		}
		source.attendeeObj.sync();
		source.answers.answer1 = 5;
		source.answers.answer2 = 5;
		source.answers.answer3 = 5;
		source.answers.answer4 = 5;
		source.answers.answer5 = 5;
		$$('radioGroup1').setValue(5);
		$$('radioGroup3').setValue(5);
		$$('radioGroup4').setValue(5);
		$$('radioGroup5').setValue(5);
		$$('radioGroup6').setValue(5);
		$$('button1').show();
		$$('button2').show();
		$$('button3').show();
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		if(attendeeObj.email)
		sources.attendee1.query("email = :1", attendeeObj.email,{
	        onSuccess: function(){
				if(sources.attendee1.length == 0 ) {
					sources.attendee.addNewElement();
					sources.attendee.serverRefresh({
						onSuccess: function(event) {
							sources.attendee.fullName = attendeeObj.name;
							sources.attendee.email = attendeeObj.email;
							sources.attendee.save({
								onSuccess: function(){
									sources.answers.attendee.set(sources.attendee);
									sources.answers.survey.set(sources.survey);
									sources.answers.save();
									$$('button1').hide();
									$$('button2').hide();
									$$('button3').show();
									console.log("answer saved");
								},
								onError: function(error){
								}
							});
						},
						onError: function(error){
								
						}
					});
				}
				else {
				sources.answers.attendee.set(sources.attendee1);
				sources.answers.survey.set(sources.survey);
				sources.answers.save();
				$$('button1').hide();
				$$('button2').hide();
				console.log("answer saved");
				}
	    	}
        });
		
		
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		attendeeObj= {};
		sources.attendeeObj.sync();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("imageButton1", "click", imageButton1.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
