﻿//Take user to home page on reload
var pageNotInit = true;
$(document).live('pageinit',function(event){//Force the app to go home after force refresh the page on browser
	
});
//Global var to hold the eval
var evalAnswers = {
		conferenceID:'',
		fullName:'',
		email:'',
		speakerID:'',
		sessionID:'',
		uniqueID:'',
		evalType:''
	}

var allSessions = [];
var people = [];
//global var to hold conference
var conference = {};
var preClassItemHTML = "";
var postClassItemHTML = "";

WAF.onAfterInit = function onAfterInit() {// @lock
	if(navigator.userAgent.indexOf('Android') == -1 && navigator.userAgent.indexOf('iPhone OS 8') == -1){
		addToHomescreen({
			maxDisplayCount: 0,
			onShow:function (){
				$(addToHomescreen().element).css("background","white");//Change popup background to white for better visual presentation
			}
		});
		addToHomescreen().clearSession();//This will make addToHome Screen Popup show up each time user visits 
	}

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock
	//Build eval page
	function buildEvalPage () {
		//Get session evals and build session eval page
		ds.Eval.getEvalQuestions('session',1,{
			onSuccess: function(findEvalQuestionEvent) {
				var questions = findEvalQuestionEvent.result;
				questions.forEach(function(question) {
					var html = "";
					//var answerNumber = "answer" + question.questionNumber;
					var answerNumber = question.questionNumber;
					if (question.questionType == "selection")
						if(!question.options)
						html = '<fieldset data-type="horizontal" data-role="controlgroup" ><legend>' + question.questionText + '</legend><input value="4" type="radio" name="'+ answerNumber +'" id="radio1"  class="answerInput"/><label for="radio1">Excellent</label><input value="3" type="radio" name="'+ answerNumber +'" id="radio2" class="answerInput"/><label for="radio2">Good</label><input value="2" type="radio" name="'+ answerNumber +'" id="radio3" class="answerInput"/><label for="radio3">Fair</label><input value="1" type="radio" name="'+ answerNumber +'" id="radio4" class="answerInput"/><label for="radio4">Poor</label></fieldset>';
						else {
							var questionOptions = question.options.split(/\s*,\s*/);
							html += '<fieldset data-type="horizontal" data-role="controlgroup" ><legend>' + question.questionText + '</legend>';
							questionOptions.forEach(function(option,optionIndex) {
								html += '<input value="'+ (optionIndex+1) +'" type="radio" name="'+ answerNumber +'" id="radio'+ (optionIndex+1) +'"  class="answerInput"/><label for="radio'+ (optionIndex+1) +'">'+ option +'</label>';
							});
							html += '</fieldset>';
						}
					if (question.questionType == "text")
						html = '<fieldset data-role="controlgroup"><label for="textarea1">'+ question.questionText + '</label><textarea placeholder="" name="'+ answerNumber +'" id="textarea1"  class="answerInput" /></textarea></fieldset>';
					$('.evalQuestionsContent').append(html);
				});
				$('#page7').trigger('create');
			}
		});
	}
	
	//Build QUiz eval Page
	function buildQuizPage(){
		ds.Eval.getEvalQuestions('quiz',1,{
			onSuccess: function(findEvalQuestionEvent) {
				var questions = findEvalQuestionEvent.result;
				questions.forEach(function(question) {
					var html = createQuestionHTML(question);
					$('.quizlQuestionsContent').append(html);
				});

				$('.quizlQuestionsContent').trigger('create');
				
			}
		});
	}
	
	function buildListItem(html, sessionArray){
		var afternoonSessionDividerAdded = false;//Flag for 3pm/4pm 10AM/11AM session divider;
		sessionArray.forEach(function(elem) {
			var languagePref = "";
			if(localStorage.getItem("LangPref") == "FR") languagePref = "_FR";
			var speakerName = "";
			var listItemHTML = "";
			if(!elem.isActivity & elem.speakers.length > 1){
				for(var session in elem.speakers) {
					speakerName +=  elem.speakers[session].fullName + ", ";
				}
			}
			else if(!elem.isActivity & elem.speakers.length > 0) {
				speakerName = htmlEncode(elem.speakers[0].fullName);
			}
			//Adding date divider before breakfast
			if(elem.startTimeString == "15:00" || elem.startTimeString == "10:15")afternoonSessionDividerAdded = false;
			if(elem.startTimeString == "16:00" && !afternoonSessionDividerAdded || elem.startTimeString == "11:15" && !afternoonSessionDividerAdded){//Add divider between 10am/11am and 3pm/4pm 
				listItemHTML += '<li id = "'+ elem.ID +'" data-theme="c" class = "" style = "height:15px;padding:1px!important"></li>';
				afternoonSessionDividerAdded = true;	
			}
			if(elem['title' + languagePref] == "Q & A") listItemHTML += '<li id = "'+ elem.ID +'" data-theme="c" class = "" style = "height:15px;padding:1px!important"></li>';//Add divider before Q&A
			if(elem['title' + languagePref].indexOf("Breakfast") != -1) html += '<li role="heading" data-role="list-divider" data-theme="b" style = "text-align:center;padding:0px!important"> '+ elem.sessionDateString +' </li>';
			if(elem['title' + languagePref] == "Welcome Reception" || elem['title' + languagePref] == "Evening with 4D") {//Apply special Welcome Reception color for 4D party
				listItemHTML += '<li id = "'+ elem.ID +'" data-theme="c" class = "" style = "height:15px;padding:1px!important"></li>';
				listItemHTML += '<li id = "'+ elem.ID +'" data-theme="c" class = "" style="background-color: #d7fcff">';
			}
			else
			listItemHTML += '<li id = "'+ elem.ID +'" data-theme="c" class = "loadSessionDetail" ' + (elem.isActivity & elem['title' + languagePref] != "Q & A" ? 'style="background-color: #eeeaea"' : 'style="background: #c6def7"') + '>';
			listItemHTML += elem.isActivity ? '' :  '<a href="#page4" data-transition="slide" >';
			listItemHTML += '<h1 class="ui-li-heading">'+ htmlEncode(elem['title' + languagePref]) +'</h1>';
			listItemHTML += '<p class="ui-li-desc">'+ htmlEncode(elem.sessionDateString) + ' at ' + htmlEncode(milToStandard(elem.startTimeString)) + ', ' + 'Room: ' + htmlEncode(elem['room' + languagePref]) + ' </p>';
			//Add a reminder for 4D Party
			if(elem['title' + languagePref] == "Evening with 4D") listItemHTML += '<p class="ui-li-desc">' + "Buses leave at 6:00pm" + ' </p>';
			listItemHTML +=	(elem.speakers.length == 0?'':'<p>Presented By ' + '<i>' + speakerName + '</i>' + ' </p>');
			listItemHTML += elem.isActivity ? '' : '</a>';
			listItemHTML += '</li>';

			if(elem['title' + languagePref].indexOf("Pre-Class") != -1) preClassItemHTML = listItemHTML.replace("9 AM","1:30 PM");//Duplicate pre-class for morning and afternoon session
			if(elem['title' + languagePref].indexOf("Post-Class") != -1) postClassItemHTML = listItemHTML.replace("9 AM","1:30 PM");//Duplicate post-class for morning and afternoon session
			if(elem['title' + languagePref].indexOf("Lunch") != -1 && elem.sessionDateString == "10/27/2014") listItemHTML += preClassItemHTML;
			if(elem['title' + languagePref].indexOf("Lunch") != -1 && elem.sessionDateString == "10/30/2014") listItemHTML += postClassItemHTML;
			html += listItemHTML;
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
	
	//Build Speaker & Staff list in page3
	function buildSpeakerListView(speakersObj) {
		var html = "";
		if (speakersObj.speakersArray.length > 0)html += '<li role="heading" data-role="list-divider" style = "text-align:center">Speakers</li>';
		speakersObj.speakersArray.forEach(function(elem) {
			html += '<li id = "'+ elem.ID +'" data-theme="c" class = "loadSpeakerProfile">';
			html += '<a href="#page5" data-transition="slide" >';
			html += '<img  style="width: 56px; max-height: 100%" src = "/images/speakerimages/' + htmlEncode(elem.picURL) + '" class = "ui-li-thumb" />';
			html += '<h1 class="ui-li-heading">'+ htmlEncode(elem.fullName) +'</h1>';
			html += '<p class="ui-li-desc">'+   htmlEncode(elem.title)  + (elem.company && elem.title?', ':"") + htmlEncode(elem.company) + '</p>';
			html += '</a>';
			html += '</li>';
		});
		if (speakersObj.staffArray.length > 0)html += '<li role="heading" data-role="list-divider" style = "text-align:center">Summit Staff</li>';
		speakersObj.staffArray.forEach(function(elem) {
			html += '<li id = "'+ elem.ID +'" data-theme="c" class = "loadSpeakerProfile">';
			html += '<a href="#page5" data-transition="slide" >';
			html += '<img  style="width: 56px; max-height: 100%" src = "/images/speakerimages/' + htmlEncode(elem.picURL) + '" class = "ui-li-thumb" />';
			html += '<h1 class="ui-li-heading">'+ htmlEncode(elem.fullName) +'</h1>';
			html += '<p class="ui-li-desc">'+   htmlEncode(elem.title)  +', '+ htmlEncode(elem.company) + '</p>';
			html += '</a>';
			html += '</li>';
		});
		var listview = document.getElementById('speakerListView');
		listview.innerHTML = html;
		if ($('#speakerListView').hasClass('ui-listview')) {
			$('#speakerListView').listview('refresh');
		}
	}
	
	//Go back to previous page
	$(".goPrevious").live('vclick', function(event) {//go to previous page in history
		event.preventDefault();
		history.back();

	});
	
	$('#cancelSummitSurvey').live('vclick', function(e) {//go to previous page in history
			if(isJQMGhostClick(e))
				return
			$.mobile.changePage($('#page1'), {
					transition: "slidedown"
			});
	});
	$('#cancelSummitQuiz').live('vclick', function(e) {//go to previous page in history
			if(isJQMGhostClick(e))
				return
			$.mobile.changePage($('#page1'), {
					transition: "slidedown"
			});
	});
	
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		if (navigator.appVersion.indexOf("Mobile") != -1 && navigator.appVersion.indexOf("Safari") == -1)
		    $("a").removeClass('goPrevious');		
				
		if(pageNotInit){
			//$.mobile.changePage($('#page1'));
			pageNotInit = false;
			if(localStorage.getItem("LangPref") == "FR")
			$.mobile.changePage('../fr.html');
			else
			$.mobile.changePage('../index.html');
		}	
		ds.Conference.find('name = :1','4D EU Summit',{// Set conference, for instance 4D Summit U.S., 4D Summit Europe
			onSuccess : function(findConferenceEvent) {
				conference = findConferenceEvent.entity;
			}
		});
		
		// Set attendee's name and email in cookie for future authentication 
		var CookieDate = new Date();
		var summitDate = new Date("10/29/2014");
		
		if (CookieDate < summitDate) {
			$('#startSummitSurvey').hide();
			$('#startSummitSurveyText').hide();
		}
		else{
			$('#startSummitSurvey').show();
			$('#startSummitSurveyText').show();	
		}
		CookieDate.setFullYear(CookieDate.getFullYear( ) +10);
		if(document.cookie.indexOf("SummitAPPID") == -1) {
			document.cookie = 'SummitAPPID = ' + uniqueid() + ';expires=' + CookieDate.toGMTString() + ';';
		}
		if(!localStorage.getItem("LangPref")) {
			localStorage.setItem("LangPref", 'EN');
		}
		var beginIndex = document.cookie.indexOf("SummitAPPID")+12;
		var endIndex = beginIndex + 32;
		var cookieID = document.cookie.substring(beginIndex,endIndex);
		
		var sessionId = '';
		var attendee = {};
		ds.Attendee.find('uniqueID == ' + cookieID ,{
			onSuccess: function(locatAttendeeEvent) {
				attendee = locatAttendeeEvent.entity;
				//Chekc if summit eval has already been submitted;
				if(attendee)
			    ds.Eval.query('evalType == :1 & attendeeEmail == :2', 'summit', attendee.email.getValue(),{
			    	onSuccess: function(findEvalEvent) {
			    		if(findEvalEvent.result.length > 0) {
							$('#startSummitSurvey span span')[0].innerHTML = "Evaluation Submitted";
							$("#startSummitSurvey").addClass('ui-disabled');
						}
			    	}
				});		
			}
		});    
		
		
		//tap event handler to load session detail
		$( ".loadSessionDetail" ).live( "vclick", function(event,ui) {
			var languagePref = "";
			if(localStorage.getItem("LangPref") == "FR") languagePref = "_FR";
			//Load session from allSessions array, this will prevent iOS 8 lock screen breaking callbacks bug.
			var speakerListHTML = '';
			var evalSpeakListHTML = '';
			var speakerMap = {};
			var session = allSessions.filter(findElement,{'ID':this.id})[0];
			//Build Session Detail page		
			$('#sessionDetailTitleDiv h2')[0].innerHTML = session['title'+ languagePref];
			$('#sessionDetailTitleDiv div p span')[0].innerHTML = session.sessionDateString + ' at ' + session.startTimeString + '<br> Conference Room: ' + session['room'+ languagePref];
			$('#sessionDescrption p')[0].innerHTML = session['description'+ languagePref];//Load session description
			if(session.speakers.length > 1 ) evalSpeakListHTML = '<option value="All Speakers">All Speakers</option>';
			for (speakerIndex in session.speakers){
				var speaker = session.speakers[speakerIndex];
				speakerListHTML += '<li class="loadSpeakerProfile" data-theme="c" id="'+ speaker.ID +'"><a  href="#page5" data-transition="slide">Speaker: '+ speaker.fullName +'</a></li>'
				//Build the dropdown for later eval
				evalSpeakListHTML += '<option value="'+ speaker.ID +'">'+ speaker.fullName +'</option>';
				speakerMap[speaker.fullName]= speaker.ID;
			}
			$('#sessionSpeakersList')[0].innerHTML = speakerListHTML;
			if ($('#sessionSpeakersList').hasClass('ui-listview'))$('#sessionSpeakersList').listview('refresh');
			(this.id == 112 || this.id == 113) ?$('#startEvalButton ').hide():$('#startEvalButton ').show();//No Eval for keynotes
			if(isJQMGhostClick(event))
				return
			sessionId = this.id;

			//Disable Eval button when session is not started
			ds.Session.isSessionAlive (sessionId,{
				onSuccess: function(checkSessionAliveEvent) {
					$("#startEvalButton").removeClass('ui-disabled');
					if(checkSessionAliveEvent.result){
						$('#startEvalButton span span')[0]?($('#startEvalButton span span')[0].innerHTML = "Evaluate this Session"):($('#startEvalButton')[0].innerHTML  = "Evaluate this Session");
						$("#startEvalButton").removeClass('ui-disabled');
					}
					else {
						$('#startEvalButton span span')[0]?($('#startEvalButton span span')[0].innerHTML = "Session has not started yet"):($('#startEvalButton')[0].innerHTML  = "Session has not started yet");
						$("#startEvalButton").addClass('ui-disabled');   //temperorally commented out for eval page development
					}
				}
			});
			
			 if(attendee)
				ds.Eval.query('sessionID == :1 & attendeeEmail == :2', sessionId, attendee.email.getValue(),{
					onSuccess: function(findEvalEvent) {
						if(findEvalEvent.result.length == session.speakers.length) {// This attendee has evaluated all speakers in this session.
							$('#startEvalButton span span')[0]?$('#startEvalButton span span')[0].innerHTML = "Evaluation Submitted":$('#startEvalButton')[0].innerHTML = "Evaluation Submitted";
							$("#startEvalButton").addClass('ui-disabled');
						}
						else if (findEvalEvent.result.length >=1 & findEvalEvent.result.length < session.speakers.length) {// This attendee has evaluated one but not all speakers in this session.
							findEvalEvent.result.forEach({
								onSuccess: function(evalEvent)
						        {
						            var eval = evalEvent.entity; // get the entity from event.entity
						            if (speakerMap[eval.speakerName.getValue()]) delete speakerMap[eval.speakerName.getValue()];
								},
								atTheEnd: function(event)
						        {
						           evalSpeakListHTML = "";
						           for (var speakerName in speakerMap) {
						           		evalSpeakListHTML += '<option value="'+ speakerMap[speakerName] +'">'+ speakerName +'</option>';
						       		}
						       		$('#evalSpeakerList')[0].innerHTML = evalSpeakListHTML;
						        }
						    });
						}
						else {// This attendee has evaluated no speakers in this session
				       		$('#evalSpeakerList')[0].innerHTML = evalSpeakListHTML;
						}
					}
				});
			else {// No attendee found, firt time user
					$('#evalSpeakerList')[0].innerHTML = evalSpeakListHTML;
			}
		});
		
		$( '#page4' ).live( 'pageshow',function(event, ui){
		  	//$('#sessionSpeakersList').listview('refresh');
		});
		$( '#page7' ).live( 'pageshow',function(event, ui){
		  	//$('#evalSpeakerList').selectmenu('refresh', true);
		});
		// tap event handler to load speak's profile
		$( ".loadSpeakerProfile" ).live( "vclick", function(event,ui) {
			var languagePref = "";
			if(localStorage.getItem("LangPref") == "FR") languagePref = "_FR";
			var speakerId = this.id;
			var sessionListHTML = '';
			var speaker = people.filter(findElement,{'ID':speakerId})[0];
			speaker.picURL? $('#speakerImage')[0].src = "/images/speakerimages/" + speaker.picURL: $('#speakerImage')[0].src = "/images/speakerimages/x.png";
			$('#speakerName h2 span')[0].innerHTML = speaker.fullName;
			$('#speakerName h3 span')[0].innerHTML = speaker.title + (speaker.title&& speaker.company?" at ":"") + speaker.company;
			$('#speakerBio p')[0].innerHTML = speaker.biography;
			if(speaker.linkedIn){
				$('#speakerLinedIn').attr('href',speaker.linkedIn);
				$('#speakerLinedIn').show();
			}
			else	
			$('#speakerLinedIn').hide();
			for (sessionIndex in speaker.sessions){
				var session = speaker.sessions[sessionIndex]; 
				sessionListHTML += '<li data-theme="c" id="'+ session.ID +'" class = "loadSessionDetail"><a  href="#page4" data-transition="slide">Session: '+ session['title'+languagePref] +'</a></li>'
			}
			$('#speakersSessionsList')[0].innerHTML = sessionListHTML;
			if ($('#speakersSessionsList').hasClass('ui-listview'))$('#speakersSessionsList').listview('refresh');
		});
		
		//Go to eval page and start eval 
		$(".startEval").live( "vclick", function(event, ui) {
			if(attendee) {
				evalAnswers.email = attendee.email.getValue();
				evalAnswers.fullName = attendee.fullName.getValue();
				evalAnswers.sessionID = sessionId;
				//Fill the Attendee info in the text fields
				$('#attendeNameInput').val(evalAnswers.fullName);
				$('#attendeEmailInput').val(evalAnswers.email);
			}
			$.mobile.changePage($('#page7'), {
					transition: "slideup"
			});
		});
		
		$("#startSummitSurvey").live( "vclick", function(event, ui) {
			if(attendee) {
				evalAnswers.email = attendee.email.getValue();
				evalAnswers.fullName = attendee.fullName.getValue();
				evalAnswers.sessionID = sessionId;
				//Fill the Attendee info in the text fields
				$('#attendeNameInputSummitEval').val(evalAnswers.fullName);
				$('#attendeEmailInputSummitEval').val(evalAnswers.email);
			}
			$.mobile.changePage($('#page6'), {
					transition: "slideup"
			});
		});
		
		$("#startSummitQuiz").live( "vclick", function(event, ui) {
			if(attendee) {
				evalAnswers.email = attendee.email.getValue();
				evalAnswers.fullName = attendee.fullName.getValue();
				evalAnswers.sessionID = sessionId;
				//Fill the Attendee info in the text fields
				$('#attendeNameInputSummitQuiz').val(evalAnswers.fullName);
				$('#attendeEmailInputSummitQuiz').val(evalAnswers.email);
			}
			$.mobile.changePage($('#page8'), {
					transition: "slideup"
			});
		});
		
		
		$( ".rankingSelect" ).bind( "change", function(event, ui) {
			var evalAnswerString = evalAnswers[this.name];
			(!evalAnswerString)?evalAnswers[this.name] = this.value:evalAnswers[this.name] = evalAnswerString.concat(', '+ this.value);
		});
		
		//Set survey and attendee while saving the eval
		$( ".saveEval" ).bind( "vclick", function(event, ui) {
			$('#attendeNameInput').blur();
			$('#attendeEmailInput').blur();
			
			evalAnswers.evalType = 'session';
			evalAnswers.sessionID = sessionId;
			if(evalAnswers.fullName && validateEmail(evalAnswers.email))
				ds.Attendee.find("email = :1", evalAnswers.email,{
				 onSuccess: function(findAttendeeEvent){
				 	$(".saveEval").addClass('ui-disabled');
				 	if(findAttendeeEvent.entity) {
				 		evalAnswers.uniqueID = findAttendeeEvent.entity.uniqueID.getValue();
						evalAnswers.speakerID = $('#evalSpeakerList')[0].value;
						ds.Eval.submitEval(evalAnswers,{
					        onSuccess:function(submitEvalEvent)
					        {	
					        	$('#startEvalButton span span')[0].innerHTML = "Evaluation Saved";
					        	$("#startEvalButton").addClass('ui-disabled');
					        	$.mobile.changePage($('#page4'), {
											transition: "slidedown"
								});
								$(".saveEval").removeClass('ui-disabled');
								$('.evalQuestionsContent')[0].innerHTML = "";
								buildEvalPage ();
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
								evalAnswers.uniqueID = attendeeEvent.entity.uniqueID.getValue();
								evalAnswers.speakerID = ($('#evalSpeakerList')[0].value);
								ds.Eval.submitEval(evalAnswers,{
							        onSuccess:function(event)
							        {	
							        	$('#startEvalButton span span')[0].innerHTML = "Evaluation Submitted";
							        	$("#startEvalButton").addClass('ui-disabled');
							        	$.mobile.changePage($('#page4'), {
											transition: "slidedown"
										});
										$(".saveEval").removeClass('ui-disabled');
										$('.evalQuestionsContent')[0].innerHTML = "";
										buildEvalPage ();
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
		
		$(".SessionListTabButton").bind( "vclick", function(event, ui) {
			$("input[data-type=search]").val("").change(); 
			if(this.id.indexOf("allSessions") > -1 ){
				buildSessionListView(allSessions);
				$("#speakersList").removeClass('ui-btn-active');
				$("#allSessions").addClass('ui-btn-active');
			}
			else if (this.id.indexOf("liveSessions") > -1 ){
				ds.Session.getLiveSessions(2,{
					onSuccess: function(e) {
						buildLiveSessionListView(e.result);
					}
				});
				$("#speakersList").removeClass('ui-btn-active');
				$("#liveSessions").addClass('ui-btn-active');
			}
			else {
				$("#liveSessionsInSpeakerListPage").removeClass('ui-btn-active');
				$("#allSessionsInSpeakerListPage").removeClass('ui-btn-active');
				$.mobile.changePage($('#page3'), {
					transition: "none"
				});
				$("#speakersListInSpeakerListPage").addClass('ui-btn-active');
			}
			$("#" + this.id).addClass('ui-btn-active');
		});
			
		$( ".saveSummitEval" ).bind( "vclick", function(event, ui) {
			evalAnswers.evalType = 'summit';
			evalAnswers.conferenceID = conference.ID.getValue();
			evalAnswers.sessionID = sessionId;
			$(".saveSummitEval").addClass('ui-disabled');
			
			if(evalAnswers.fullName && validateEmail(evalAnswers.email))
				ds.Attendee.find("email = :1", evalAnswers.email,{
				 onSuccess: function(findAttendeeEvent){
				 	if(findAttendeeEvent.entity) {
				 		evalAnswers.uniqueID = findAttendeeEvent.entity.uniqueID.getValue();
						evalAnswers.speakerID = $('#evalSpeakerList')[0].value;
						ds.Eval.submitEval(evalAnswers,{
					        onSuccess:function(submitEvalEvent)
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
								evalAnswers.uniqueID = findAttendeeEvent.entity.uniqueID.getValue;
								//evalAnswers.speakerID.setValue($('#evalSpeakerList')[0].value);
								ds.Eval.submitEval(evalAnswers,{
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
		
		
		ds.Session.getLiveSessions(2,{
			onSuccess: function(e) {
				allSessions = e.result.allSessionsArray;
				buildLiveSessionListView(e.result);
			}
		});
		
		//Get All speakers and build speakers list
		ds.Speaker.getAllSpeakers({
			onSuccess: function(e) {
				people = e.result.speakersArray.concat(e.result.staffArray);
				buildSpeakerListView(e.result);
			}
		});
		
		//Initialize session eval page
		buildEvalPage();
		
		//Initialize Summit eval page
		ds.Eval.getEvalQuestions('conference',1,{
			onSuccess: function(findEvalQuestionEvent) {
				var questions = findEvalQuestionEvent.result;
				questions.forEach(function(question) {
					var html = createQuestionHTML(question);
					$('.summitEvalQuestionsContent').append(html);
				});

				$('.summitEvalQuestionsContent').trigger('create');
				
			}
		});
		
		//Initialize QUiz eval Page
		buildQuizPage();
	};// @lock
	$( ".answerInput" ).live( "change", function(event, ui) {
		//check if answerInput if multi selection
		if(this.getAttribute('answervalue')){
			if($(this).is(':checked'))
				evalAnswers[this.name]?evalAnswers[this.name] += this.getAttribute('answervalue')+ " ": evalAnswers[this.name] = this.getAttribute('answervalue')+ " ";
			else {//if multi selection is unchecked the answer value should be removed from answer string
				var answerIndex = evalAnswers[this.name].indexOf(this.getAttribute('answervalue'));
				evalAnswers[this.name]= evalAnswers[this.name].slice(0, answerIndex) + evalAnswers[this.name].slice(answerIndex+2);//slice the answer and the space after it
			}
		}
		else
		evalAnswers[this.name] = this.value;
	});
	
	$( ".changeLang" ).live( "vclick", function(event, ui) {
		if(localStorage.getItem("LangPref") == 'EN'){
			localStorage.setItem("LangPref", 'FR');
			window.location.href = "http://127.0.0.1:8081/fr.html";
		}
		else {
			localStorage.setItem("LangPref", 'EN');
			window.location.href = "http://127.0.0.1:8081/index.html";
		}
		
		buildQuizPage();
	});
	//find Session ID in seesion array element
	function findElement(element,index,array){
		return element.ID == this.ID
	}
	
	
	//Ultility Build Question
	function createQuestionHTML(question){
		var languagePref = "";
		var questionText  = question.questionText;
		var questionOptions = question.options;
		if(localStorage.getItem("LangPref") == "FR") languagePref = "_FR";
		var html = "";
		var answerNumber = question.questionNumber;
		if(question['questionText' + languagePref]) questionText = question['questionText' + languagePref];
		if(question['options' + languagePref]) questionOptions = question['options' + languagePref];
		switch(question.questionType){
			case "text":
				html = '<fieldset data-role="controlgroup"><label for="textarea1">'+ questionText + '</label><textarea placeholder="" name="'+ answerNumber +'" id="textarea1" class="answerInput" /></textarea></fieldset>';
				return html;
				break
			case "selection":
				if(!questionOptions)
					html = '<fieldset data-type="horizontal" data-role="controlgroup" ><legend>' + questionText + '</legend><input value="4" type="radio" name="'+ answerNumber +'" id="radio1"  class="answerInput"/><label for="radio1">Excellent</label><input value="3" type="radio" name="'+ answerNumber +'" id="radio2" class="answerInput"/><label for="radio2">Good</label><input value="2" type="radio" name="'+ answerNumber +'" id="radio3" class="answerInput"/><label for="radio3">Fair</label><input value="1" type="radio" name="'+ answerNumber +'" id="radio4" class="answerInput"/><label for="radio4">Poor</label></fieldset>';
				else {
					var options = questionOptions.split(/\s*,\s*/);
					html += '<fieldset data-type="horizontal" data-role="controlgroup" ><legend>' + questionText + '</legend>';
					options.forEach(function(option,optionIndex) {
						html += '<input value="'+ (optionIndex+1) +'" type="radio" name="'+ answerNumber +'" id="radio'+ (optionIndex+1) +'"  class="answerInput"/><label for="radio'+ (optionIndex+1) +'">'+ option +'</label>';
					});
					html += '</fieldset>';
				}
				return html;
				break
			case "dropdown":
				var options = questionOptions.split(/\s*,\s*/);
				html += '<div data-role="fieldcontain"><label for="answer'+ answerNumber +'" class="select" style="width:100%">'+ questionText +'</label>';
				html += '<select name="'+ answerNumber +'" id="answer'+ answerNumber +'" data-mini="true" class="answerInput">';
				html += '<option value="0"></option>';
				options.forEach(function(option,optionIndex) {
					html += '<option value="'+ (optionIndex+1) +'">'+ option +'</option>';
				});
				html += '</select></div>';
				return html;
				break
			case  "multiple-selection":
				var options = questionOptions.split(/\s*,\s*/);
				html += '<fieldset data - role = "controlgroup" class = "ui-controlgroup ui-controlgroup-vertical ui-corner-all" >';
				html += '<div role = "heading" class = "ui-controlgroup-label" > <legend> '+ questionText +'</legend></div><div class="ui-controlgroup-controls ">';
				options.forEach(function(option,optionIndex) {
					html += '<div class="ui-checkbox"><label for="checkbox-'+ (optionIndex+1) +'" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off ui-first-child">'+ option +'</label><input type="checkbox" answervalue="'+(optionIndex+1)+'" name="'+ answerNumber +'" id="checkbox-'+ (optionIndex+1) +'" class="answerInput" data-mini="true"></div>';
				});
				html += ' </div></fieldset>';
				return html;
				break
			default:
				return html;
			}
	}
	
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
	
	//Utility: check if click event firing twice on same position.
	  var lastclickpoint, curclickpoint;
	  var isJQMGhostClick = function(event){
	      curclickpoint = event.clientX+'x'+event.clientY;
	      if (lastclickpoint === curclickpoint) {
	        lastclickpoint = '';
	        return true;
	      } else {
	        //alert(lastclickpoint);
	        lastclickpoint = curclickpoint;
	        return false;
	      }
	  }
	  
	//Convert Military Time To Standard Time With JavaScript
	function milToStandard(value) {
		if (value !== null && value !== undefined){ //If value is passed in
		if(value.indexOf('AM') > -1 || value.indexOf('PM') > -1){ //If time is already in standard time then don't format.
		  return value;
		}
		else {
		  if(value.length == 5){ //If value is the expected length for military time then process to standard time.
		    var hour = value.substring ( 0,2 ); //Extract hour
		    var minutes = value.substring ( 3,5 ); //Extract minutes
		    
		   	
		    var identifier = 'AM'; //Initialize AM PM identifier

		    if(hour == 12){ //If hour is 12 then should set AM PM identifier to PM
		      identifier = 'PM';
		    }
		    if(hour == 0){ //If hour is 0 then set to 12 for standard time 12 AM
		      hour=12;
		    }
		    if(hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
		      hour = hour - 12;
		      identifier='PM';
		    }
		    else if (hour < 10) hour = hour.replace('0','');

		    if (minutes == "00") //remove 00 if it's 00 sharp 
		    return hour + ' ' + identifier
		    else
		    return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
		  }
		  else { //If value is not the expected length than just return the value as is
		    return value;
		  }
    }
  }
};
// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
