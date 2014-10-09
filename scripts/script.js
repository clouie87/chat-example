
var name = "";

function getName(){
	name = prompt("Hey new friend! What's your name?");
		if (name.length === 0){// my first successful if statement!!!! I'm so stocked!! 
			alert("Please enter your name!");
		return false;
	}
	document.getElementById("welcome").appendChild(document.createTextNode(name)); //i needed to add this here so that it knows ??
	console.log("Welcome" + name + "!");// this lets me see it on my console. 
};

