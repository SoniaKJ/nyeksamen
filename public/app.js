var dogfacts=angular.module("dogfacts",[]); //creating a module that store the application data

dogfacts.controller("thecontroller",["$scope","quizM","DataHandle",function($scope,quizM,DataHandle)
{
	$scope.activedog={};  // I am creating an empty object that holds the information of active dogs
	$scope.Search="";     // Search variable for holding the user input in search bar
	$scope.quizM=quizM;
	$scope.ActivateDogQuiz=function()
	{
		quizM.changeState("quiz",true);
	}
	$scope.changeActivedog=function(index)
	{
		// The activedog holds the information about active dogs
          $scope.activedog=index;
	}

        $scope.dogsData = DataHandle.dogsData;

 }]);


// The quiz controller

 dogfacts.controller("quizcntrl",["$scope","quizM","DataHandle",function($scope,quizM,DataHandle)
 {

        $scope.quizM=quizM;
        $scope.DataHandle=DataHandle;
         $scope.qActive=0;
         var numQuestionsAnswered=0;
         $scope.error=false;
         $scope.finalise=false;



         // setActiveQuestion function find the next unanswered question
         $scope.setQActive=function(index)
         {
         	if(index===undefined)
         	{
	         	var breakout=false;
	         	var quizLength=DataHandle.dogQs.length-1;
	         	while(!breakout)
	         	{
	         		$scope.qActive=$scope.qActive<quizLength?++$scope.qActive:0;

	         		if($scope.qActive===0)
	         		{
	         			$scope.error=true;
	         		}
	         		if(DataHandle.dogQs[$scope.qActive].selected==null)
	         		{
	         			breakout=true;
	         		}
	         	}
            }
           else{
           	     $scope.qActive=index;
               }
         }


        $scope.questionAnswered=function()
        {
        	var quizLength = DataHandle.dogQs.length;
        	if(DataHandle.dogQs[$scope.qActive].selected !==null)
        	{
        		numQuestionsAnswered++;
        		if(numQuestionsAnswered >= quizLength)
        		{
        			//finalize the quize
        			for(var i=0;i<quizLength;i++)
        			{
        				if(DataHandle.dogQs[i].selected===null)
        				{
        					setQActive(i);
        					return;
        				}
        			}
        			$scope.error=false;
        			$scope.finalise=true;
        			return;
        		}
        	}
        	$scope.setQActive();
        }
       // This is for making the selected answers background blue.
        $scope. selectAnswer=function(index)
        {
          DataHandle.dogQs[$scope.qActive].selected = index;
        }

         $scope. finaliseAnswers=function()
         {
         	$scope.finalise=false;
         	numQuestionsAnswered=0;
         	$scope.qActive=0;
         	quizM.markQuiz();
         	quizM.changeState("quiz",false);
         	quizM.changeState("results",true);

         }


 }]);

 // I am defining the factory

 dogfacts.factory("quizM",QuizM);
      QuizM.$inject =['DataHandle'];
      function QuizM(DataHandle)
 {
      var quizObject=
      {
      	 quizeActive:false,
      	 resultsActive:false,
      	 correctAnswers:[],
      	 numCorrect:0,
      	 changeState:function(metric,state)
      	 {
      	 	if(metric==='quiz')
      	 	{
      	 		quizObject.quizeActive=state;

      	 	}else if(metric==='results')
      	 	{
      	 		quizObject.resultsActive=state;
      	 	}else
      	 	{
      	 		return false;
      	 	}

      	 },

         markQuiz:function()
         {
         	quizObject.correctAnswers = DataHandle.correctAnswers;

			    for(var i = 0; i < DataHandle.dogQs.length; i++)
			    {
			        if(DataHandle.dogQs[i].selected === DataHandle.correctAnswers[i])
			        {
			            DataHandle.dogQs[i].correct = true;
			            quizObject.numCorrect++;
			        }
			        else
			        {
			            DataHandle.dogQs[i].correct = false;
			        }
			    }
         }
      };

      return quizObject;
 };

/////////////////////////////////////////////////// How to save the quiz result in the database???? /////////////////////////////////////

		 // Creating the result controller

     dogfacts.controller("resultsCtrl",["$scope","quizM","DataHandle",function($scope,quizM,DataHandle)
 {
       $scope.quizM=quizM;
       $scope.DataHandle=DataHandle;
       $scope.qActive=0;

       $scope.getAnswerClass=function getAnswerClass(index)
       {
              if(index === quizM.correctAnswers[$scope.qActive]){
               return "bg-success";
			    }else if(index === DataHandle.dogQs[$scope.qActive].selected){
			        return "bg-danger";
			    }
       }
        $scope.setQActive=function setQActive(index)
        {
        	$scope.qActive = index;
        }
        $scope.calculatePerc=function calculatePerc()
        {
        	return quizM.numCorrect / DataHandle.dogQs.length * 100;

        }

        $scope.reset=function reset()
        {
        	 quizM.changeState("results", false);
			    quizM.numCorrect = 0;

			    for(var i = 0; i < DataHandle.dogQs.length; i++)
			    {
			        var data = DataHandle.dogQs[i]; // Binding the current question to data.

			        data.selected = null;
			        data.correct = null;
			    }
        }

 }]);

	// Here I am defining another factory
 dogfacts.factory("DataHandle",function()
 {
      var dataObject=
      {
      	dogsData:dogsData,
      	dogQs:dogQs,
      	correctAnswers:correctAnswers
      };
    return dataObject;

 });


   // The Dog Quiz Questions data

var correctAnswers = [0, 1, 3, 0, 2, 1, 0, 2, 0, 3];

var dogQs  = [
        {
            type: "text",
            text: "How much can a labrador weigh?",
            possibilities: [
                {
                    answer: "Up to 26 kg"
                },
                {
                    answer: "Up to 115 kg"
                },
                {
                    answer: "Up to 220 kg"
                },
                {
                    answer: "Up to 500 kg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the typical lifespan of a Australian Shepherd?",
            possibilities: [
                {
                    answer: "150 years"
                },
                {
                    answer: "15 years"
                },
                {
                    answer: "80 years"
                },
                {
                    answer: "40 years"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these is the Labrador?",
            possibilities: [
                {
                    answer: "https://blog.zooplus.pl/wp-content/uploads/sites/8/2015/03/owczarek_niemiecki.jpg"
                },
                {
                    answer: "http://nuovabrianza.it/wp-content/uploads/2016/04/foto-cani-bulldog-inglese-260461.jpg"
                },
                {
                    answer: "http://www.hondenrassen.nl/public/img/content/140520_57-20140912150747.jpg"
                },
                {
                    answer: "https://blog.zooplus.pl/wp-content/uploads/sites/8/2016/02/labrador3.jpg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these is the Poodle?",
            possibilities: [
                {
                    answer: "https://dogbreedsexpert.com/wp-content/uploads/StandardPoodle6.jpg"
                },
                {
                    answer: "https://www.aler.si/modules/uploader/uploads/news/pictures_news/alja_ki.jpg"
                },
                {
                    answer: "http://puppytoob.com/wp-content/uploads/2013/04/great_dane.jpg"
                },
                {
                    answer: "https://www.fast-alles.net/pictures/394409.jpg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the lifespan of the German Shepherd?'",
            possibilities: [
                {
                    answer: "10 years"
                },
                {
                    answer: "4 years"
                },
                {
                    answer: "13 years"
                },
                {
                    answer: "14 years"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What collors can a Labrador have?",
            possibilities: [
                {
                    answer: "Brown"
                },
                {
                    answer: "Brown, black and yellow"
                },
                {
                    answer: "Brown, white and yellow"
                },
                {
                    answer: "Brown and yellow"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "What is the largest dog of these?",
            possibilities: [
                {
                    answer: "Great Dane"
                },
                {
                    answer: "Labrador"
                },
                {
                    answer: "Chihuahua"
                },
                {
                    answer: "German Shepherd"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "image",
            text: "Which of these dogs is the Great Dane?",
            possibilities: [
                {
                    answer: "https://blog.zooplus.pl/wp-content/uploads/sites/8/2016/02/labrador3.jpg"
                },
                {
                    answer: "https://dogbreedsexpert.com/wp-content/uploads/StandardPoodle6.jpg"
                },
                {
                    answer: "http://puppytoob.com/wp-content/uploads/2013/04/great_dane.jpg"
                },
                {
                    answer: "https://www.aler.si/modules/uploader/uploads/news/pictures_news/alja_ki.jpg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "How Heavy can a German Shepherd be?",
            possibilities: [
                {
                    answer: "40 kg"
                },
                {
                    answer: "9 kg"
                },
                {
                    answer: "15 kg"
                },
                {
                    answer: "30 kg"
                }
            ],
            selected: null,
            correct: null
        },
        {
            type: "text",
            text: "Which of these dogs can have the collor yellow?",
            possibilities: [
                {
                    answer: "German Shepherd"
                },
                {
                    answer: "Australian Shepherd"
                },
                {
                    answer: "Labrador"
                },
                {
                    answer: "Poodle"
                }
            ],
            selected: null,
            correct: null
        }
    ];

     // Some json data
    var dogsData =

     [


        {
            type: "Labrador",
            image_url:"https://blog.zooplus.pl/wp-content/uploads/sites/8/2016/02/labrador3.jpg",
            height: "55-60 centimeters",
            weight: "25-26 kg",
            lifespan: "10-14 years",
            color: "Black, yellow and brown",
            description: "The Labrador Retriever, or just Labrador, is a type of retriever-gun dog. The Labrador is one of the most popular breeds of dog in Canada, the United Kingdom and the United States. A favourite disability assistance breed in many countries, Labradors are frequently trained to aid the blind, those who have autism, to act as a therapy dog, or to perform screening and detection work for law enforcement and other official agencies. Additionally, they are prized as sporting and hunting dogs. A few kennels breeding their ancestors, the St. John's water dog, were in England. At the same time, a combination of the sheep protection policy in Newfoundland and rabies quarantine in the United Kingdom, led to the gradual demise of the St. John's water dog in Canada."
        },
        {
            type: "German Shepherd",
            image_url: "https://blog.zooplus.pl/wp-content/uploads/sites/8/2015/03/owczarek_niemiecki.jpg",
            height: "55-65 centimeters",
            weight: "22-40 kg",
            lifespan: "9-13 years",
            color: "Tan with black saddlery",
            description: "German Shepherds are medium to large-sized dogs. The breed standard height at the withers is 60–65 cm (24–26 in) for males, and 55–60 cm (22–24 in) for females. German Shepherds are longer than tall, with an ideal proportion of 10 to 8 1/2. The AKC official breed standard does not set a standard weight range. They have a domed forehead, a long square-cut muzzle with strong jaws and a black nose. The eyes are medium-sized and brown with a lively, intelligent and self-assured look. The ears are large and stand erect, open at the front and parallel, but they often are pulled back during movement."
        },
        {
            type: "Poodle",
            image_url: "https://dogbreedsexpert.com/wp-content/uploads/StandardPoodle6.jpg",
            height: "24-60 centimeters",
            weight: "2-26 kg",
            lifespan: "12-15 years",
            color: "All natural colors",
            description: "The poodle is a group of formal dog breeds, the Standard Poodle, Miniature Poodle and Toy Poodle. The origin of the breed is still discussed, with a prominent dispute over whether the poodle descends from Germany as a type of water dog, or from the French Barbet. Ranked second most intelligent dog breed just behind the Border Collie, the poodle is skillful in many dog sports and activities, including agility, obedience, tracking to herding, circus performers or assistance dogs. Poodles have taken top honors in many conformation shows, including Best in Show at the Westminster Kennel Club Dog Show in 1991 and 2002, and at the World Dog Show in 2007 and 2010"
        },
        {
            type: "Bulldog",
            image_url: "http://nuovabrianza.it/wp-content/uploads/2016/04/foto-cani-bulldog-inglese-260461.jpg",
            height: "31-40 centimeters",
            weight: "18-23 kg",
            lifespan: "3-11 Years",
            color: "Brown, white and black",
            description: "A Bulldog is a medium-sized breed of dog commonly referred to as the English Bulldog or British Bulldog. It is a muscular, hefty dog with a wrinkled face and a distinctive pushed-in nose. The American Kennel Club (AKC), The Kennel Club (UK), and the United Kennel Club (UKC) oversee breeding records. The Bulldog Club of America (BCA) maintains the standard of excellence for the guidance of breeders, owners and judges in the United States. Bulldogs were the fourth most popular purebred in the US in 2016 according to the American Kennel Club"
        },
        {
            type: "Chihuahua",
            image_url: "http://www.hondenrassen.nl/public/img/content/140520_57-20140912150747.jpg",
            height: "15-23 centimeters",
            weight: "1,5-3 kg",
            lifespan: "12-20 years",
            color: "White, golden and brown",
            description: "Chihuahuas are the smallest breed recognized by some kennel clubs. There are two varieties of Chihuahua – the Smooth Coat (shorthaired) and the Long Coat (longhaired). Both the Smooth and the Long Coats have their special attractions and are equally easy to keep clean and well groomed. The UK Kennel Club considers smooth and long coat Chihuahuas two distinct breeds; matings between the two are not eligible for KC registration."
        },
        {
            type: "Australian Shepherd",
            image_url: "https://www.fast-alles.net/pictures/394409.jpg",
            height: "46-58 centimeters",
            weight: "14-23 kg",
            lifespan: "13-15 years",
            color: "Tri-colered and be-colered",
            description: "The Australian Shepherd, often known simply as the Aussie, is a medium-sized breed of dog that was, despite its name, developed on ranches in the Western United States during the 19th century. The dog was developed from a breed or breeds from the Basque country in Western Europe. It was brought by Basque people to the United States. These people had previously lived only briefly in Australia before moving to America. The breed otherwise has no connection to Australia. There are a number of different theories regarding how the breed came to be associated with Australia, but there is no consensus. They are similar in appearance to the popular English Shepherd and Border Collie breeds, and research has found that Australian Shepherds and Border Collies are closely related to each other; both the Border Collie and Australian Shepherd are slightly more distantly related to other kinds of Collies and to Shetland Sheepdogs"
        },
        {
            type: "Siberian Husky",
            image_url: "https://www.aler.si/modules/uploader/uploads/news/pictures_news/alja_ki.jpg",
            height: "46-61 centimeters",
            weight: "16-27 kg",
            lifespan: "12-14 years",
            color: "Be-colored (black and white)",
            description: "The Siberian Husky is a medium size working dog breed that originated in Northeast Asia. The breed belongs to the Spitz genetic family. It is recognizable by its thickly furred double coat, erect triangular ears, and distinctive markings. The original Siberian Huskies were bred by the Chukchi people — whose hunter-gatherer culture relied on their help. It is an active, energetic, resilient breed, whose ancestors lived in the extremely cold and harsh environment of the Siberian Arctic. William Goosak, a Russian fur trader, introduced them to Nome, Alaska during the Nome Gold Rush, initially as sled dogs. The people of Nome referred to Siberian Huskies as Siberian Rats due to their size of 40–50 lb (18–23 kg), versus the Malamutes size of 75–85 lb (34–39 kg)"
        },
        {
            type: "Great Dane",
            image_url: "http://puppytoob.com/wp-content/uploads/2013/04/great_dane.jpg",
            height: "71-79 centimeters",
            weight: "50-82 kg",
            lifespan: "8-10 years",
            color: "Brown, black and white",
            description: "The Great Dane is a large German breed of domestic dog known for its giant size. The German name of the breed is Deutsche Dogge, or German Mastiff. The French name is Dogue Allemand. The Great Dane is one of the tallest dog breeds. The record holder for tallest dog was a Great Dane called Zeus (died September 2014; aged 5), that measured 111.8 cm (44.0 in) from paw to shoulder"
        }
];

      /* end of json data*/
