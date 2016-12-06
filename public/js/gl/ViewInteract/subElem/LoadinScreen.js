function LoadinScreen(){
	
	this.blackScreen = document.createElement('div');
	this.blackScreen.style.width = "100%";
	this.blackScreen.style.height = "100%";
	this.blackScreen.style.position = "absolute";
	this.blackScreen.style.zIndex = "15";
	this.blackScreen.style.backgroundColor = "rgba(10,10,10,0.8)";
	this.blackScreen.style.display = "none";

/*
	this.pBar = document.createElement('PROGRESS');
	this.pBar.setAttribute("value", 0);
	this.pBar.setAttribute("max", 100);
*/

	this.pBarFrame = document.createElement('div');

	this.pBarFrame.style.position = "relative";
	this.pBarFrame.style.width = "50%";
	this.pBarFrame.style.top = "50%";
	this.pBarFrame.style.height = "20px";
	this.pBarFrame.style.zIndex = "20";
	this.pBarFrame.style.margin = "auto";
	this.pBarFrame.style.textAlign = "center";
	this.pBarFrame.style.display = "none";
	this.pBarFrame.style.backgroundColor = "grey";


	this.pBarRun = document.createElement('div');
	this.pBarRun.style.position = 'absolute';
	this.pBarRun.style.width = "1%";
	this.pBarRun.style.height = "20px";
	this.pBarRun.style.backgroundColor = 'lightblue';


	this.pBarFrame.appendChild(this.pBarRun);



	this.mergeMsg = document.createElement('p');
	this.mergeMsg.innerHTML = "Merging Geometries";
	this.mergeMsg.style.position = "relative";
	this.mergeMsg.style.width = "50%";
	this.mergeMsg.style.top = "50%";
	this.mergeMsg.style.zIndex = "20";
	this.mergeMsg.style.margin = "auto";
	this.mergeMsg.style.textAlign = "center";
	this.mergeMsg.style.display = "none";
	this.mergeMsg.style.color = "white";


	document.getElementById('glDIV').appendChild(this.blackScreen);
	this.blackScreen.appendChild(this.pBarFrame);
	this.blackScreen.appendChild(this.mergeMsg);
}	

LoadinScreen.prototype.showLoading = function() {
	console.log("sshow loading");
	this.mergeMsg.style.display = "none";
	this.pBarFrame.style.display = "block";
	this.blackScreen.style.display = "block";

};
LoadinScreen.prototype.hideLoading = function() {

	this.blackScreen.style.display = "none";
	this.pBarRun.style.width = "1%" ;

};

LoadinScreen.prototype.setpBar = function(v){

	//console.log("add Width", v);
	this.pBarRun.style.width = v+"%";


}

LoadinScreen.prototype.setMergeMsg = function(){

	this.pBarRun.style.width = "100%";
	this.pBarFrame.style.display = "none";
	this.mergeMsg.style.display = "block";


}