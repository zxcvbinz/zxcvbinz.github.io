var color = 0;

function CustomDarkMode(platform){
	var text = document.getElementById("change-color");
	if (!color)
	{	document.body.className += ' dark';
		color = 1;
		if (platform != "Mobile")
			text.style.color = "white";
	}else{
		document.body.className -= ' dark';
		color = 0;
		text.style.color = "";
	}
}
