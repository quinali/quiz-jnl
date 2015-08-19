var models = require ('../models/models.js');


// Autoload - factoriza el código si ruata incluye :quizId
// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

//GET /quizes?search=
exports.search = function (req,res, next){
	var search = req.query.search;
	console.log("---------------->index.search()");
	if(typeof search != 'undefined'){
		 search = search.replace(/\s/g, "%");
		 models.Quiz.findAll({where: ["pregunta like ?", '%'+search+'%']}).then(
                function(quizes) {
                             res.render('quizes/index', {quizes: quizes,errors: []});
						}
					).catch(function(error){ next(error);})
		}
};
//GET /quizes
//exports.index = function (req,res){
//
//	var search = req.query.search;
//
//	console.log("---------------->index.findAll()");
//	        models.Quiz.findAll().then(
//			   function(quizes) {
//							res.render('quizes/index.ejs', {quizes: quizes, errors: []});
//						}
//				    ).catch(function(error){ next(error)});
//	};


exports.index = function(req, res) {  
  var options = {};
  
  models.Quiz.findAll(options).then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error)});
};



//GET /quizes/question

exports.show = function(req,res){
	res.render('quizes/show',
		{quiz: req.quiz,
		 errors: [] 
		 }
		);
};


//GET /quizes/answer
exports.answer = function (req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
	   resultado = 'Correcto';
	}

	res.render('quizes/answer',
		{quiz: req.quiz,
		 respuesta: resultado,
		 errors: [] });
     };

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( {pregunta: "Pregunta", respuesta: "Respuesta"});
        res.render ('quizes/new', 
			{
				quiz:quiz,
				errors:[]
			}
		);
};

// POST /quizes/create
exports.create = function(req, res) {
  
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.save({fields: ["pregunta", "respuesta","tema"]}).then( function(){ 
	res.redirect('/quizes');
   }) 
};

exports.edit = function(req,res){
  var quiz = req.quiz;

  res.render('quizes/edit',
	{
		quiz: quiz,
		errors: []
	}
  )
};

// PUT /quizes/:id
exports.update = function(req,res){
   req.quiz.pregunta =  req.body.quiz.pregunta;
   req.quiz.respuesta = req.body.quiz.respuesta;
   req.quiz.tema = req.body.quiz.tema;

   req.quiz
   .validate()
   .then(
      function(err){
        if(err) {
          res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
       } else {
            req.quiz
            .save( {fields: ["pregunta","respuesta","tema"]})
            .then( function(){ res.redirect('/quizes');});
       } 
    }
   )
};


// DELETE /quizes/:id
exports.destroy = function(req,res) {
	req.quiz.destroy().then( function() {
       res.redirect('/quizes');
    }).catch(function(error){next(error)});
};

