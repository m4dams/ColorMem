//score variables
var cMaxS=100;
var highScore=null;
var maxScore=0;
var num=3; //3 for easy 6 hor hard
var rNum=0; //number of sequence replays
var scores=document.querySelectorAll(".scores");//all score related divs
var squares=document.querySelectorAll(".square"); //selecting the tiles to color
var start=document.querySelector("#start");//start button
var replay=document.querySelector("#replay");//replay sequence button
var hScoreDisplay=document.querySelector("#hScore");//high score 
var cMax=document.querySelector("#cMax");//current max
var cSore=document.querySelector("#cSore"); //current points
//color handling
var color={
	arrayGenerator:function(num){
		//empty array
		var array=[];
		//fill array with num*color
		for(var i=0;i<num;i++){
			array[i]=color.generator();
		}
		//return array
		return array;
	},
	generator:function(){
		//generating an rgb color and returning it 
		var arr=[];
		for (i=0;i<3;i++){
			arr[i]=Math.floor(Math.random()*256);
		}
		return "rgb("+arr[0]+", "+arr[1]+", "+arr[2]+")";
	}
}
//array holding random colors
var colors=color.arrayGenerator(num);
//object stores game related code
var game={
	//generated
	sequence:"",
	//player input
	psequence:"",
	//start
	start:function(num){
		start.textContent="Start New Game";
		for (var i=0;i<num;i++){
			squares[i].classList.remove("hidden");
			squares[i].classList.add("visible");
		};
		for(var i=0;i<scores.length;i++){
			scores[i].classList.remove("hidden");
			scores[i].classList.add("visible");
		}
		game.generate(num);
		rNum=0;
		maxScore=0;
		console.log("highScore:"+highScore);
		console.log("maxScore:"+maxScore);
		console.log("rNum:"+rNum);
		console.log("cMaxS:"+cMaxS);
		game.scoreKeeper.cMaxScore(rNum,cMaxS);
		game.scoreKeeper.hS(highScore,maxScore);
	},
	//Delay function. 18th try AND FINALLY WORKING!!!!!!
	delay:async function f(x,time) {
		let promise = new Promise((resolve, reject) => {
    	setTimeout(() => resolve(squares[x].classList.toggle("display")), time)
  	});

  	let result = await promise; // wait until the promise resolves (*)

	},
	//comparing player input to generated input
	evaluate: function(sequence,psequence){
		//splitting strings into arrays for easier use
		var arr1=sequence.split("");
		var arr2=psequence.split("");
		var x=false;
		//checking if player input does exceed generated input length
		if(arr2.length<=arr1.length){
			//doing comparison
			for(var i=0;i<arr2.length;i++){
				if (arr2[i]!==arr1[i]){
					/*exiting function when detecting mismatch --- need to add code from blocking further input 					eg.: remove eventlisteners perhaps*/
					x=false;
					game.psequence="";
					return alert("failure");
				} else {
					x=true;

				}
			}
		} else {
			return alert("STOP YOUR CLICKING SPREE!");
		}
		/*ENDSTATE: if sequences match (equal length and value of x=true) continue game by adding new digit to 			sequence */
		//Check if Score is higher than hScore, and add new hScore if true
		if(arr2.length==arr1.length&&x){
			if(num==3){
				game.generateE();
			} else if (num==6) {
				game.generateH();
			}
			track();
			game.scoreKeeper.hS(highScore,maxScore);
			game.psequence="";
			game.playSequence();
			rNum=0;
		   }
	},
	//generating game interface
	generate:function (num){ 
		for(var i=0;i<squares.length;i++){
			game.sequence="";
			colors=color.arrayGenerator(num);
			if (num==3){
				game.generateE();
			} else if (num==6) {
				game.generateH();
			} else {
				alert("Mode selection variable corrupted!\nPlease refresh page!");
			}
			//coloring tiles
			squares[i].style.backgroundColor=colors[i];
			//adding event listener
			squares[i].addEventListener("click", function(){
				game.evaluate(game.sequence,game.psequence);
				})
		}
	},
	//Easy difficulty sequence generation
	generateE: function(){
		game.sequence+=Math.floor(Math.random()*3);
		return game.sequence;
	},
	//Hard difficulty sequence generation
	generateH: function(){
		if(game.sequence=="") {
			game.sequence+=Math.floor(Math.random()*6);
			return game.sequence;
		} else {
			var length=game.sequence.length;
			game.sequence="";
			for(var i=0;i<length+1;i++){
				game.sequence+=Math.floor(Math.random()*6);
			}
			return game.sequence;
		}
		
	},
	//function for displaying sequence to user
	playSequence: function(){
		console.log("game.sequence="+game.sequence);
		var arr1=game.sequence.split("");
		let time=0;
		for (var i=0;i<arr1.length;i++){
		//code to display sequence
			var x=arr1[i];
			time+=500;
			game.delay(x,time);
			time+=500
			game.delay(x,time);
			}
		},
	//all score related code is in here
	scoreKeeper: {
		//Current Max Score -- uses the number of times the sequence was replayed by the player
		cMaxScore: function(rNum,cMaxS){
			//Current max
			cMaxS=100;
			switch (rNum) {
				//at game and round start
				case 0: cMax.textContent=cMaxS;console.log(cMaxS); return cMaxS; break;
				//cases of repeats
				case 1: cMax.textContent=cMaxS/2; cMaxS=cMaxS/2;console.log(cMaxS);return cMaxS; break;
				case 2: cMax.textContent=cMaxS/4; cMaxS=cMaxS/4; console.log(cMaxS); return cMaxS; break;
				case 3: cMax.textContent=cMaxS/cMaxS; cMaxS=cMaxS/cMaxS; console.log(cMaxS);return cMaxS; break;
				//when rNum is not in the expected range
				default: alert(rNum+"\nAn error occured most likely due to you tempering with the code.\nTry the magic refresh button ;)")
				}
			
			},
		//Keeps track of highScore
		hS: function(){
				if(highScore<maxScore){
					highScore=maxScore;
					hScoreDisplay.textContent=highScore;
					return highScore;
				} else if(highScore!==0||highScore!=="" ){
					hScoreDisplay.textContent=highScore;
				} 
		}
		
		}
	}

function track(){
		console.log("maxScore="+maxScore+"\ncMaxS="+cMaxS);
		maxScore+=cMaxS;
		
		cScore.textContent=maxScore;
		return maxScore;
}

replay.addEventListener("click",function(){
			if(rNum<3){
			   game.playSequence();
				rNum+=1
				game.scoreKeeper.cMaxScore(rNum,cMaxS)
			   } else {
				   game.scoreKeeper.cMaxScore(rNum,cMaxS)
				   alert("You already replayed the sequence 3 times."+"\n"+"If you can't recall it you should start a new game")
			   }
		});
//starting the game
start.addEventListener("click",function(){
	game.start(num);
	game.playSequence();
});