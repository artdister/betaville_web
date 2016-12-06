function HelpFrame(){
	helpFrame = this;

	var heigh = window.innerHeight - 43;
	this.backblack = document.createElement('div');
	this.backblack.style.width = "100%";
	this.backblack.style.height = heigh + "px";
	this.backblack.style.position = "absolute";
	this.backblack.style.bottom = 0;
	this.backblack.style.backgroundColor = "rgba(0,0,0,0.5)"; 
	this.backblack.style.zIndex = 10;
	this.backblack.style.display = "none"




	this.iFrame = document.createElement("iframe");
	this.iFrame.src = "../help/index.html";

	this.iFrame.style.position = "absolute";
	this.iFrame.style.width = "98%";
	this.iFrame.style.height = "97%";
	this.iFrame.style.margin = "1%";
	this.iFrame.style.left = 0;
	this.iFrame.style.border = "0";
	this.backblack.appendChild(this.iFrame);


		document.body.appendChild(this.backblack);
}
HelpFrame.prototype.showFrame = function() {


	if(this.backblack.style.display == "none"){
		thatTopMenuBar.helpBtnText.nodeValue = "close";
		thatTopMenuBar.helpBTN.style.backgroundColor = "rgba(0,0,0,0.5)"; 
		thatTopMenuBar.helpBTN.style.color = "white";

		this.backblack.style.display = "block";
	}else{
		thatTopMenuBar.helpBtnText.nodeValue = "Help";
		thatTopMenuBar.helpBTN.style.backgroundColor = '#F2F2F2';  
		thatTopMenuBar.helpBTN.style.color = "black"

		this.backblack.style.display = "none";
	}

};
