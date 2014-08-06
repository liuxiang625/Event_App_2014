//Take user to home page on reload
var pageNotInit = true;
$(document).live('pageinit',function(event){//Force the app to go home after force refresh the page on browser
	if(pageNotInit){
		$.mobile.changePage($('#page1'));
		pageNotInit = false;
	}	
});
var evalAnswers = {
		fullName:'',
		email:'',
		speakerName:'',
		answer1:'',
		answer2:'',
		answer3:'',
		answer4:'',
		answer5:'',
		answer6:'',
		answer7:'',
		answer8:'',
		answer9:'',
		answer10:'',
		answer11:'',
		answer12:'',
		answer13:''
	}
	
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock
	//Global var to hold the eval
	
	
	function buildSessionListView(arr) {
		var html = "";

		arr.forEach(function(elem) {
		if(elem.title.indexOf("Registration") != -1){
				var dayString = '';
				switch(elem.sessionDateString) {
					case '10/27/2014':
						dayString = 'Tuesday'
						break
					case '10/28/2014':
						dayString = 'Wednesday'
						break
					case '10/29/2014':
						dayString = 'Thursday'
						break
					case '10/30/2014':
						dayString = 'Friday'
						break	
//					case '10/19/2013':
//						dayString = 'Saturday'
//						break
				}
				html += '<li role="heading" data-role="list-divider">' + htmlEncode(elem.sessionDateString) + '  ' + dayString + '</li>';
			}
			html += '<li id = "'+ htmlEncode(elem. __KEY) +'" data-theme="c" class = "loadSessionDetail" ' + (elem.isActivity ? 'style="background-color: #d3d3d3"' : '') + '>';
			html += elem.isActivity ? '' :  '<a href="#page4" data-transition="slide" >';
			html += '<h1 class="ui-li-heading">'+ htmlEncode(elem.title) +'</h1>';
			html += '<p class="ui-li-desc">'+ htmlEncode(elem.sessionDateString) + ' - ' + htmlEncode(elem.startTimeString) +'- '+ htmlEncode(elem.endTimeString) + ', ' + htmlEncode(elem.room) +' </p>';
			html += elem.isActivity ? '' : '</a>';
			html += '</li>';
		});
		var listview = document.getElementById('sessionListview');
		listview.innerHTML = html;
		if ($('#sessionListview').hasClass('ui-listview')) {
			$('#sessionListview').listview('refresh');
		}
	}
	
	
	$(".goPrevious").live('tap', function() {//go to previous page in history
				history.back();
				return false;
	});
	
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// Set attendee's name and email in cookie for future authentication 
		var CookieDate = new Date;
		CookieDate.setFullYear(CookieDate.getFullYear( ) +10);
		if(document.cookie.indexOf("SummitAPPID") == -1) {
			document.cookie = 'SummitAPPID = ' + uniqueid() + ';expires=' + CookieDate.toGMTString() + ';';
		}
		var beginIndex = document.cookie.indexOf("SummitAPPID")+12;
		var endIndex = beginIndex + 32;
		var cookieID = document.cookie.substring(beginIndex,endIndex);
		
		var sessionSurvey = {};
		var sessionId = '';
		var attendee = {};
		ds.Attendee.find('uniqueID == ' + cookieID ,{
			onSuccess: function(locatAttendeeEvent) {
				attendee = locatAttendeeEvent.entity;
			}
		});
		
		//tap event handler to load session detail
		$( ".loadSessionDetail" ).live( "tap", function() {
			sessionId = this.id;
			if(attendee) {
				ds.Answer.query('sessionID == :1 ', sessionId, {
					autoExpand:'attendee',
					onSuccess: function(findAnswerEvent) {
						findAnswerEvent.entityCollection.toArray('attendeeEmail', {
							onSuccess: function(findAttendeeeAnswerEvent) {
								var answersArr = findAttendeeeAnswerEvent.result;
								$('#startEvalButton span span')[0].innerHTML = "Evaluate this Session";
								$("#startEvalButton").removeClass('ui-disabled');
								answersArr.forEach(function(elem) { 
								if (elem.attendeeEmail == attendee.email.getValue()){
									$('#startEvalButton span span')[0].innerHTML = "Evaluation Submitted";
									$("#startEvalButton").addClass('ui-disabled');
								}
								});
							}
						});
					},
					onError: function(error) {
						console.log(error.error[0]);
					}
				});
			}
			ds.Session.find("ID = " + sessionId , {
				autoExpand:'presentaors',
				onSuccess: function(findEvent) {
					var speakerListHTML = '';
					var evalSpeakListHTML = '';
					
					var sessionEntity = findEvent.entity;
					
					$('#sessionDetailTitleDiv h3')[0].innerHTML = sessionEntity.title.getValue();
					$('#sessionDetailTitleDiv div p span')[0].innerHTML = sessionEntity.sessionDateString.getValue() + ', ' + sessionEntity.startTimeString.getValue() + '- ' 
																	 + sessionEntity.endTimeString.getValue() + ', ' + sessionEntity.room.getValue();
					$('#sessionDescrption p')[0].innerHTML = sessionEntity.description.getValue();//Load session description

					//build speakers list
					sessionEntity.presentaors.getValue().forEach({  
				        onSuccess: function(presentorEvent)
				        {
				            var presentor = presentorEvent.entity; // get the entity from event.entity
				            speakerListHTML += '<li data-theme="c" id="'+ presentor.speaker.relKey +'"><a  href="#page5" data-transition="slide">Speaker: '+ presentor.speakerName.getValue() +'</a></li>'
							//Build the dropdown for later eval
							evalSpeakListHTML += '<option value="'+ presentor.speakerName.getValue() +'">'+ presentor.speakerName.getValue() +'</option>'
						}
				    });
					$('#sessionSpeakersList')[0].innerHTML = speakerListHTML;
					$('#evalSpeakerList')[0].innerHTML = evalSpeakListHTML;
					$('#sessionSpeakersList').listview('refresh');
				}
			});
		});
		
		$( '#page4' ).live( 'pageshow',function(event, ui){
		  	$('#sessionSpeakersList').listview('refresh');
		});
		$( '#page7' ).live( 'pageshow',function(event, ui){
		  	$('#evalSpeakerList').selectmenu('refresh', true);
		});
		$( '#page5' ).live( 'pageshow',function(event, ui){
		  	$('#speakersSessionsList').listview('refresh');
		});
		
		// tap event handler to load speak's profile
		$( "#sessionSpeakersList li" ).live( "tap", function() {
			///images/speakerImages/sergiy-temnikov.jpg
			var speakerId = this.id;
			var sessionListHTML = '';
			 ds.Speaker.find("ID = " + speakerId , {
		  			autoExpand:'presentations',
		   			onSuccess: function(findSpeakerEvent) {
		   				var speakerEntity = findSpeakerEvent.entity;
		   				if(speakerEntity.picURL.getValue()) $('#speakerImage')[0].src = "/images/speakerImages/" + speakerEntity.picURL.getValue();
		   				$('#speakerName h2 span')[0].innerHTML = speakerEntity.fullName.getValue();
		   				$('#speakerName h3 span')[0].innerHTML = speakerEntity.title.getValue() + " at " + speakerEntity.company.getValue();
		   				$('#speakerBio p')[0].innerHTML = speakerEntity.biography.getValue();
		   				
		   				//build speakers' session list
		   				speakerEntity.presentations.getValue().forEach({  
					        onSuccess: function(presentationEvent)
					        {
					            var presentation = presentationEvent.entity; // get the entity from event.entity
					            sessionListHTML += '<li data-theme="c" id="'+ presentation.session.relKey +'" class = "loadSessionDetail"><a  href="#page4" data-transition="slide">Speaker: '+ presentation.sessionName.getValue() +'</a></li>'
							}
					    });
						$('#speakersSessionsList')[0].innerHTML = sessionListHTML;
		   				$('#speakersSessionsList').listview('refresh');
		   			}
		   	 });
		});
		
		//Go to eval page and start eval 
		$(".startEval").live( "tap", function(event, ui) {
			if(attendee) {
				evalAnswers.email = attendee.email.getValue();
				evalAnswers.fullName = attendee.fullName.getValue();
				$('#attendeeInfo').hide();
			}
			ds.Survey.find('session.ID = ' + sessionId, {
				onSuccess: function(findSurveyEvent) {
					sessionSurvey = findSurveyEvent.entity;
					$.mobile.changePage($('#page7'), {
						transition: "slideup"
					});
				},
				onError: function(error){
				}
			});
		});
		
		$( ".answerInput" ).bind( "change", function(event, ui) {
			evalAnswers[this.name] = this.value;
		});
		
		$( ".rankingSelect" ).bind( "change", function(event, ui) {
			var evalAnswerString = evalAnswers[this.name];
			(!evalAnswerString)?evalAnswers[this.name] = this.value:evalAnswers[this.name] = evalAnswerString.concat(', '+ this.value);
		});
		
		//Set survey and attendee while saving the eval
		$( ".saveEval" ).bind( "tap", function(event, ui) {
			$(".saveEval").addClass('ui-disabled');
			var newEval = ds.Answer.newEntity();
			newEval.answer1.setValue(evalAnswers.answer1);
			newEval.answer2.setValue(evalAnswers.answer2);
			newEval.answer3.setValue(evalAnswers.answer3);
			newEval.answer4.setValue(evalAnswers.answer4);
			newEval.answer5.setValue(evalAnswers.answer5);
			newEval.answer6.setValue(evalAnswers.answer6);
			newEval.answer7.setValue(evalAnswers.answer7);
			newEval.speakerName.setValue($('#evalSpeakerList')[0].value);
			newEval.survey.setValue(sessionSurvey);	
					
			if(evalAnswers.fullName && validateEmail(evalAnswers.email))
			ds.Attendee.find("email = :1", evalAnswers.email,{
				 onSuccess: function(findAttendeeEvent){
				 	
				 	if(findAttendeeEvent.entity) {
				 		newEval.attendee.setValue(findAttendeeEvent.entity);
						newEval.save({
					        onSuccess:function(event)
					        {	
					        	$('#startEvalButton span span')[0].innerHTML = "Evaluation Saved";
					        	$("#startEvalButton").addClass('ui-disabled');
					        	$.mobile.changePage($('#page4'), {
											transition: "slidedown"
								});
								$(".saveEval").removeClass('ui-disabled');
					        }
					    });					
				 	}
				 	else {
				 		var newAttendee = ds.Attendee.newEntity();
						newAttendee.fullName.setValue(evalAnswers.fullName);
						newAttendee.email.setValue(evalAnswers.email);
						newAttendee.uniqueID.setValue(cookieID);
						newAttendee.save({
							onSuccess: function(attendeeEvent){
								newEval.attendee.setValue(attendeeEvent.entity);
								newEval.save({
							        onSuccess:function(event)
							        {	
							        	$('#startEvalButton span span')[0].innerHTML = "Evaluation Submitted";
							        	$("#startEvalButton").addClass('ui-disabled');
							        	$.mobile.changePage($('#page4'), {
											transition: "slidedown"
										});
										$(".saveEval").removeClass('ui-disabled');
							        }
							    });		
							},
							onError: function(error){
							}
						});
				 	}
				 }
			});
			else
			!validateEmail(evalAnswers.email)?alert('Please enter a Valid email!'):alert('Please enter a Valid name!')

		});

		$("#sessionsDateList").bind( "change", function(event, ui) {
			var dataString = this.value;
			ds.Session.query("sessionDateString > '10/26' and sessionDateString begin :1",dataString, {
			//pageSize:1,
			orderBy:"sessionDateString, startTimeString", //ID
			onSuccess: function(e) {
				e.entityCollection.toArray("title,isActivity,room,startTimeString,endTimeString,sessionDateString", {
					onSuccess: function(e2) {
						buildSessionListView(e2.result);
					}
				});
			}
		});
			
		});
		$( ".saveSummitEval" ).bind( "tap", function(event, ui) {
			$(".saveSummitEval").addClass('ui-disabled');
			var newEval = ds.Answer.newEntity();
			newEval.answer1.setValue(evalAnswers.answer1);
			newEval.answer2.setValue(evalAnswers.answer2);
			newEval.answer3.setValue(evalAnswers.answer3);
			newEval.answer4.setValue(evalAnswers.answer4);
			newEval.answer5.setValue(evalAnswers.answer5);
			newEval.answer6.setValue(evalAnswers.answer6);
			newEval.answer7.setValue(evalAnswers.answer7);
			newEval.answer8.setValue(evalAnswers.answer8);
			newEval.answer9.setValue(evalAnswers.answer9);
			newEval.answer10.setValue(evalAnswers.answer10);
			newEval.answer11.setValue(evalAnswers.answer11);
			newEval.answer12.setValue(evalAnswers.answer12);
			newEval.answer13.setValue(evalAnswers.answer13);
			
					
			if(evalAnswers.fullName && validateEmail(evalAnswers.email))
			ds.Attendee.find("email = :1", evalAnswers.email,{
				 onSuccess: function(findAttendeeEvent){
				 	
				 	if(findAttendeeEvent.entity) {
				 		newEval.attendee.setValue(findAttendeeEvent.entity);
						newEval.save({
					        onSuccess:function(event)
					        {	
					        	$('#startSummitSurvey span span')[0].innerHTML = "Evaluation Saved";
					        	$("#startSummitSurvey").addClass('ui-disabled');
					        	$.mobile.changePage($('#page1'), {
											transition: "slidedown"
								});
								$(".saveSummitEval").removeClass('ui-disabled');
					        }
					    });					
				 	}
				 	else {
				 		var newAttendee = ds.Attendee.newEntity();
						newAttendee.fullName.setValue(evalAnswers.fullName);
						newAttendee.email.setValue(evalAnswers.email);
						newAttendee.uniqueID.setValue(cookieID);
						newAttendee.save({
							onSuccess: function(attendeeEvent){
								newEval.attendee.setValue(attendeeEvent.entity);
								newEval.save({
							        onSuccess:function(event)
							        {	
							        	$('#startSummitSurvey span span')[0].innerHTML = "Evaluation Submitted";
							        	$("#startSummitSurvey").addClass('ui-disabled');
							        	$.mobile.changePage($('#page1'), {
											transition: "slidedown"
										});
										$(".saveSummitEval").removeClass('ui-disabled');
							        }
							    });		
							},
							onError: function(error){
							}
						});
				 	}
				 }
			});
			else
			!validateEmail(evalAnswers.email)?alert('Please enter a Valid email!'):alert('Please enter a Valid name!')

		});

		//Get all sessions and build the session list
		ds.Session.query("", {
			//pageSize:1,
			orderBy:"sessionDateString, startTimeString", //ID
			onSuccess: function(e) {
				e.entityCollection.toArray("title,isActivity,room,startTimeString,endTimeString,sessionDateString", {
					onSuccess: function(e2) {
						buildSessionListView(e2.result);
					}
				});
			}
		});
	};// @lock
	
	//Utility: Generates UniqueID for cookie and localstorage
	function uniqueid(){
	    // always start with a letter (for DOM friendlyness)
	    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
	    do {                
	        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
	        var ascicode=Math.floor((Math.random()*42)+48);
	        if (ascicode<58 || ascicode>64){
	            // exclude all chars between : (58) and @ (64)
	            idstr+=String.fromCharCode(ascicode);    
	        }                
	    } while (idstr.length<32);

	    return (idstr);
	}
	
	//Utility: Validate Email using regx
	function validateEmail(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	} 
// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
