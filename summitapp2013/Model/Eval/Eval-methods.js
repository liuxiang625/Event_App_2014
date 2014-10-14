

model.Eval.methods.getEvalQuestions = function(evalType,conferenceID) {
	var evalQuestions = [];
	evalQuestions = ds.EvalQuestion.query("evalType = :1",evalType).orderBy("questionNumber").toArray("questionText,questionType,questionNumber,evalType,options");
	return evalQuestions;
};
model.Eval.methods.getEvalQuestions.scope = "public";



model.Eval.methods.submitEval = function(evalAnswers) {
	var token = currentSession().promoteWith('admin');
	var attendee = ds.Attendee.find('uniqueID = :1', evalAnswers.uniqueID);
	attendee.fullName = evalAnswers.fullName;
	attendee.email = evalAnswers.email;
	attendee.save();
	
	if(evalAnswers.evalType == 'session') {
		var session = ds.Session(evalAnswers.sessionID);
		if(evalAnswers.speakerID != "All Speakers" || session.presentaors.length == 1) {
			var answerNumber = 1;
			var newEval = new ds.Eval();
			newEval.attendee = attendee;
			newEval.session = session;
			newEval.speaker = ds.Speaker(evalAnswers.speakerID);		
			newEval.conference = session.conference;
			newEval.evalType = evalAnswers.evalType;
			newEval.save();
			while(evalAnswers[answerNumber]){
					newAnswer = new ds.EvalAnswer();
					newAnswer.eval = newEval;
					newAnswer.answerNumber = answerNumber;
					newAnswer.attendee = attendee;
					newAnswer.answerText = evalAnswers[answerNumber];
					newAnswer.save();
					answerNumber += 1;
			}
		}
		else {
			session.speakers.forEach(
				function(prentation) {
			        var newEval = new ds.Eval();
					newEval.attendee = attendee;
					newEval.session = session;
					newEval.speaker = prentation.speaker;		
					newEval.conference = ds.Conference[evalAnswers.conferenceID];
					newEval.evalType = evalAnswers.evalType;
					newEval.save();
					while(evalAnswers[answerNumber]){
						newAnswer = new ds.EvalAnswer();
						newAnswer.eval = newEval;
						newAnswer.answerNumber = answerNumber;
						newAnswer.attendee = attendee;
						newAnswer.answerText = evalAnswers[answerNumber];
						newAnswer.save();
						answerNumber += 1;
					}
	    	});
		}
	}
	
	else if (evalAnswers.evalType == 'summit') {
		var answerNumber = 1;
		var newEval = new ds.Eval();
			newEval.attendee = attendee;
			newEval.evalType = evalAnswers.evalType;
			newEval.save();
			debugger;
			while(evalAnswers[answerNumber]){
					newAnswer = new ds.EvalAnswer();
					newAnswer.eval = newEval;
					newAnswer.answerNumber = answerNumber;
					newAnswer.attendee = attendee;
					newAnswer.answerText = evalAnswers[answerNumber];
					newAnswer.save();
					answerNumber += 1;
			}
	}
	currentSession().unPromote(token);
	return true;
	
	
};
model.Eval.methods.submitEval.scope = "public";
