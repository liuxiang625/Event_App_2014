

model.Eval.methods.getEvalQuestions = function(evalType,conferenceID) {
	var evalQuestions = [];
	evalQuestions = ds.EvalQuestion.query("evalType = :1",evalType).orderBy("questionNumber").toArray("questionText,questionType,questionNumber,evalType,options");
	return evalQuestions;
};
model.Eval.methods.getEvalQuestions.scope = "public";

