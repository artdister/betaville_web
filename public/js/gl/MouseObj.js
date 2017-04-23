/*
*	mange the mouse on the scene for interactions
*/
function MouseObj(){
	
	this.pos = new THREE.Vector3(0,0,0);
	this.userHasClicked = false;
	this.button = "";
	this.flag = 0;


	this.raycaster = new THREE.Raycaster();
	this.raycaster.ray.direction.set(0, -1, 0);



}

//call mouse click
MouseObj.prototype.mouseClick = function(event, flag){
	if(event.button == 0){
  		this.button = "left";
  		this.flag = flag;
	}else if(event.button == 2){
  		this.pos.z =  1;
  		this.button = "right";		
	}
	thisCore.mouse.userHasClicked = true;
}

//call on mosue move
MouseObj.prototype.mouseMove = function(event){

	var gldiv = document.getElementById('glDIV');

	this.pos.x = ( ( (event.clientX-200 ) - thisCore.renderer.domElement.offsetLeft )/ thisCore.renderer.domElement.width ) * 2 - 1;
	this.pos.y = - ( ( (event.clientY-44) - thisCore.renderer.domElement.offsetTop ) / thisCore.renderer.domElement.height ) * 2 + 1;
	this.pos.z =  0.5;

	//console.log(this.pos, event);
	
};

//renderer function for the mouse
MouseObj.prototype.render = function(){

	this.raycaster.setFromCamera(this.pos.clone(), thatControl.camera);

};