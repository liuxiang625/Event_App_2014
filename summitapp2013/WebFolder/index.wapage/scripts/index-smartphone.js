﻿//Take user to home page on reload
var pageNotInit = true;
$(document).live('pageinit',function(event){//Force the app to go home after force refresh the page on browser
	if(pageNotInit){
		$.mobile.changePage($('#page1'));
		pageNotInit = false;
	}	
});
//Global var to hold the eval
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

var allSessions = [];
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	function buildListItem(html, sessionArray){
		sessionArray.forEach(function(elem) {
			var speakerName = "";
			if(!elem.isActivity & elem.speakers.length > 1){
				for(var session in elem.speakers) {
					speakerName +=  elem.speakers[session].fullName + ", ";
				}
			}
			else if(!elem.isActivity & elem.speakers.length > 0) {
				speakerName = htmlEncode(elem.speakers[0].fullName);
			}
			html += '<li id = "'+ elem.ID +'" data-theme="c" class = "loadSessionDetail" ' + (elem.isActivity ? 'style="background-color: #d3d3d3"' : '') + '>';
			html += elem.isActivity ? '' :  '<a href="#page4" data-transition="slide" >';
			html += '<h1 class="ui-li-heading">'+ htmlEncode(elem.title) +'</h1>';
			html += '<p class="ui-li-desc">'+   htmlEncode(elem.startTimeString)  +'- '+ htmlEncode(elem.endTimeString) + ', '  + htmlEncode(elem.room) + ', ' + htmlEncode(elem.sessionDateString) +  ' </p>';
			html +=	(elem.speakers.length == 0?'':'<p>Presented By ' + '<i>' + speakerName + '</i>' + ' </p>') 
			html += elem.isActivity ? '' : '</a>';
			html += '</li>';
		});
		
		return html
	}
	function buildSessionListView(arr) {
		var html = "";
		html += '<li role="heading" data-role="list-divider" style = "text-align:center">All Sessions</li>';
		html = buildListItem(html, arr);
		var listview = document.getElementById('sessionListview');
		listview.innerHTML = html;
		if ($('#sessionListview').hasClass('ui-listview')) {
			$('#sessionListview').listview('refresh');
		}
	}
	
	function buildLiveSessionListView(sessionsObj) {
		var html = "";
		if (sessionsObj.liveSessionsArray.length > 0)html += '<li role="heading" data-role="list-divider" style = "text-align:center">Live Sessions</li>';
		html = buildListItem(html, sessionsObj.liveSessionsArray);
		html += '<li role="heading" data-role="list-divider" style = "text-align:center"> Upcoming Sessions </li>';
		html = buildListItem(html, sessionsObj.commingSessionsArray);
		
		var listview = document.getElementById('sessionListview');
		listview.innerHTML = html;
		if ($('#sessionListview').hasClass('ui-listview')) {
			$('#sessionListview').listview('refresh');
		}
	}
	//speakerListView
	function buildSpeakerListView(speakersObj) {
		var html = "";
		if (speakersObj.speakersArray.length > 0)html += '<li role="heading" data-role="list-divider" style = "text-align:center">Speakers</li>';
		html = buildListItem(html, sessionsObj.liveSessionsArray);
		html += '<li role="heading" data-role="list-divider" style = "text-align:center"> Staff </li>';
		html = buildListItem(html, sessionsObj.commingSessionsArray);
		
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
								if($('#startEvalButton span span')[0])$('#startEvalButton span span')[0].innerHTML = "Evaluate this Session";//Button text may not be wrapped with span 
								$("#startEvalButton").removeClass('ui-disabled');
								answersArr.forEach(function(elem) { 
								if (elem.attendeeEmail == attendee.email.getValue()){
									$('#startEvalButton span span')[0].innerHTML = "Evaluation Submitted";
									$("#startEvalButton").addClass('ui-disabled');
								}
								});
								
								//Disabl Eval button when session is not started
								ds.Session.isSessionAlive ({
									onSuccess: function(checkSessionAliveEvent) {
										var evalButtonText = "";
										$('#startEvalButton span span')[0]?(evalButtonText = $('#startEvalButton span span')[0].innerHTML): evalButtonText = ($('#startEvalButton')[0].innerHTML)
										if(checkSessionAliveEvent.result){
											$('#startEvalButton span span')[0]?($('#startEvalButton span span')[0].innerHTML = "Evaluate this Session"):($('#startEvalButton')[0].innerHTML  = "Evaluate this Session");
											$("#startEvalButton").removeClass('ui-disabled');
										}
										else{
											$('#startEvalButton span span')[0]?($('#startEvalButton span span')[0].innerHTML = "Session has not started yet"):($('#startEvalButton')[0].innerHTML  = "Session has not started yet");
											$("#startEvalButton").addClass('ui-disabled');
										}
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
					$('#sessionDetailTitleDiv div p span')[0].innerHTML = sessionEntity.startTimeString.getValue() + '- ' 
																	 + sessionEntity.endTimeString.getValue() + ', ' + sessionEntity.room.getValue()  + ', ' +  sessionEntity.sessionDateString.getValue();
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
			var speakerId = this.id;
			var sessionListHTML = '';
			 ds.Speaker.find("ID = " + speakerId , {
		  			autoExpand:'presentations',
		   			onSuccess: function(findSpeakerEvent) {
		   				var speakerEntity = findSpeakerEvent.entity;
		   				speakerEntity.picURL.getValue()? $('#speakerImage')[0].src = "/images/speakerImages/" + speakerEntity.picURL.getValue(): $('#speakerImage')[0].src = "/images/speakerImages/x.png";
		   				$('#speakerName h2 span')[0].innerHTML = speakerEntity.fullName.getValue();
		   				$('#speakerName h3 span')[0].innerHTML = speakerEntity.title.getValue() + " at " + speakerEntity.company.getValue();
		   				$('#speakerBio p')[0].innerHTML = speakerEntity.biography.getValue();
		   				speakerEntity.linkedIn.getValue()?$('#speakerLinedIn').prop('href',speakerEntity.linkedIn.getValue()).show():$('#speakerLinedIn').hide();
		   				
		   				//build speakers' session list
		   				speakerEntity.presentations.getValue().forEach({  
					        onSuccess: function(presentationEvent)
					        {
					            var presentation = presentationEvent.entity; // get the entity from event.entity
					            sessionListHTML += '<li data-theme="c" id="'+ presentation.session.relKey +'" class = "loadSessionDetail"><a  href="#page4" data-transition="slide">Session: '+ presentation.sessionName.getValue() +'</a></li>'
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
				//$('#attendeeInfo').hide();
				$('#attendeNameInput').val(evalAnswers.fullName);
				$('#attendeEmailInput').val(evalAnswers.email);
				//Fill the Attendee info in the text fields
				
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

		
//		$("input[type='checkbox']").bind( "change", function(event, ui) {
//			if(this.checked){
//				buildSessionListView(allSessions);
//			}
//			else {
//				ds.Session.getLiveSessions({
//					onSuccess: function(e) {
//						buildLiveSessionListView(e.result);
//					}
//				});
//			}
//		});
		
		$(".SessionListTabButton").bind( "tap", function(event, ui) {
			$("#" + this.id).addClass('ui-btn-active');
			if(this.id == "allSessions" )
				buildSessionListView(allSessions);
			else if (this.id == "liveSessions" ){
				ds.Session.getLiveSessions({
					onSuccess: function(e) {
						buildLiveSessionListView(e.result);
					}
				});
			}
			else
				$.mobile.changePage($('#page3'), {
					transition: "slide"
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
		
		//Get live and upcoming sessions
		ds.Session.getLiveSessions({
			onSuccess: function(e) {
				allSessions = e.result.allSessionsArray;
				buildLiveSessionListView(e.result);
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
