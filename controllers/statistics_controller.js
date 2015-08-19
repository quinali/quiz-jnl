var models = require ('../models/models.js');
var Sequelize = require ('sequelize');

var statistics = {
         questions: 0,
         comments: 0,
         average_comments: 0,
         no_commented: 0,
         commented_questions: 0
 };


//Calculando las estadisticas
exports.index = function(req, res, next) {

	console.log('------>statistics.calculate()');
	
	models.Quiz.count()
	.then(function(questions){
                statistics.questions = questions;
		return  models.Comment.count();})
	.then(function(comments){
		statistics.comments = comments;
		return (statistics.comments / statistics.questions).toFixed(2); })
	.then(function(average_comments) {
		statistics.average_comments = average_comments;
	        return 	models.Comment.findAll(
				{attributes:['QuizId'],
				group: ['QuizId']}); })

	.then(function(commented_questions) {
		console.log('--------->callback(comented_questions)');
		statistics.commented_questions = commented_questions.length;
		return (statistics.questions - statistics.commented_questions); })

	.then(function(no_commented) {
			statistics.no_commented = no_commented; 
		})
	.finally(function(){
                res.render('statistics/index', {statistics: statistics, errors: []}); })

  };
	

//exports.index = function(req, res) {
//	res.render('statistics/index', {statistics: statistics, errors: []});
//};

//GET /quizes/statistics
exports.showOld = function(req, res){

        console.log('------>statistics.index()');


	//Numero de preguntas
	var numPreg=0;

	models.Quiz.count().then(function(count){
		numPreg = count;
		console.log('numPreg ------> '+count);
	});


	console.log('numPreg ------> '+ numPreg);

	//Numero de comentarios	
	models.Comment.count().then(function(count){
                console.log('comentarios ------> '+count);
        });


	//Media de comentarios por pregunta
	var media = 0;

	models.Comment.findAll ({
		 attributes:['QuizId',[Sequelize.fn('count', Sequelize.col('*')),'Contador']],
		 group: ['QuizId']
		}
	).then(function(result){
		
		 var i;
		 var sum=0;
		 
		 for (i=0; i <result.length; i++) {
			sum+=parseInt(result[i].get('Contador'));
		}

		media = sum/numPreg;

		console.log('media ------> '+media);

	}


	);

	
	//Numero de preguntas con comentario
	var commentedAnswer=0;
	models.Comment.findAll({
		 attributes:['QuizId'],
		 group: ['QuizId']
		}

		).then(function(result){
			commentedAnswer = result.length;
			console.log('preguntas con comentario ------> '+ commentedAnswer);
        });


	res.render('statistics/index',
              { numPreguntas: numPreg,
		media: media,
		commentedAnswer: commentedAnswer,
		unCommentedAnswer: numPreg - commentedAnswer,
		errors: []
               }
              );
};

