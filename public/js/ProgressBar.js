function ProgressBar(){
	
	this.pbar = document.getElementById('progressbar')
	this.pframe = document.getElementById('progresFrame');

	this.pframe.style.display = "none";



}
ProgressBar.prototype.show = function(){

	this.pframe.style.display = "block";

}
ProgressBar.prototype.hide = function(){

	this.pframe.style.display = "none";

}
ProgressBar.prototype.showMSG = function(msg, value){

	//this.pbar.setAttribute('aria-valuenow', value);
	this.pbar.style.width = value+"%";
	this.pbar.children[0].innerHTML = msg;

}
ProgressBar.prototype.loadData = function(){
	




}

ProgressBar.prototype.riseValue = function(){


}