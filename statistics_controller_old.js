var models = require ('../models/models.js');
var Sequelize = require ('sequelize');


//GET /quizes/statistics

exports.index = function(req, res){

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

