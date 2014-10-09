
var name = "";

function getName(){
	name = prompt("Hey new friend! What's your name?");
		if (name.length === 0){
			alert("Please enter your name!");
		return false;
	}
};

var welcome = document.createTextNode(name).value;
console.log("Welcome " + name);
document.write("Welcome " + name);


function messages(){
	if(name === name){
		function changeBgPurple(){
			messages.bgColor = "purple";
		}
	}else{
		function changeBgYellow(){
			messages.bgColor = "yellow";
		}
	}
};