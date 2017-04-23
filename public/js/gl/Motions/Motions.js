/*
*	handle the UI navigation
*/
function Motions(){
	motions = this; 
	this.lookAtDir = new THREE.Vector2();
	this.interval;
	this.runned = false;

	this.tempDirVec = new THREE.Vector2();
	this.lookAtHeigh = 0;

	this.rMatrix = new THREE.Matrix4();
}

//rotate camera on x/z
Motions.prototype.rotateDeg = function(angle){


		motions.rotate = new THREE.Vector3();
		angle = ( angle ) * (Math.PI/180); // Convert to radians
		motions.rotate.x = Math.cos(angle) * (motions.cP.x) - Math.sin(angle) * (motions.cP.z);
		motions.rotate.z = Math.sin(angle) * (motions.cP.x) + Math.cos(angle) * (motions.cP.z);
		motions.rotate.y = 0;

};

//rotate camera vertical
Motions.prototype.rotateVertic = function(angle){

		angle = ( angle ) * (Math.PI/180); // Convert to radians
		motions.rotateAxis = motions.cP.clone();

		//motions.rotateAxis.x = Math.cos(0) * Math.sin(angle);
		//motions.rotateAxis.y = Math.sin(0) * Math.sin(angle);
		//motions.rotateAxis.z = Math.cos(angle);
		motions.rotateAxis.applyAxisAngle( motions.rotate.normalize(), angle ).multiply(motions.cP);

};


//start interval on button press
Motions.prototype.startInterval = function(){

	var key = this.getAttribute('motion');
	this.src = camControll.imgLibActiv[key];
	camControll.action = this.getAttribute("motion");
    motions.interval = setInterval(motions.animation, 10);

    



};

//run the animati on 
Motions.prototype.animation = function(){


	if(motions.runned == false){
		var cam = thatControl.camera.position.clone();
		var lookAt = thatControl.camLookAt.clone();


		motions.cP = new THREE.Vector3();
		motions.cP.x = lookAt.x - cam.x;
		motions.cP.y = lookAt.y - cam.y;
		motions.cP.z = lookAt.z - cam.z;

		motions.dSpeed = (motions.cP.length()*0.01);



		

		motions.runned = true;
	
	}
	if(camControll.action == 'mLeft'){

		motions.rotateDeg(-90);
		motions.moveCam();

	}else
	if(camControll.action == 'mUp'){

			//motions.rotateDeg(0);
			//motions.moveCam();	

		thatControl.camera.position.y += motions.dSpeed;
		motions.lookAtHeigh += motions.dSpeed ;
		thatControl.camLookAt.y += motions.dSpeed;

		


	}else
	if(camControll.action == 'mDown'){

		//motions.rotateDeg(180);
		//motions.moveCam();
		if(thatControl.camera.position.y >= thatControl.camLookAt.y){
			thatControl.camera.position.y -= motions.dSpeed;
		}
		
		if(motions.lookAtHeigh >= 0){
			motions.lookAtHeigh -= motions.dSpeed;
			thatControl.camLookAt.y -= motions.dSpeed;
		
		}

	}else
	if(camControll.action == 'mRight'){

		motions.rotateDeg(90);
		motions.moveCam();

	}else
	if(camControll.action == 'rLeft'){
	
		motions.runned = false;
		motions.rotateDeg(-0.5);
		motions.rotateCam();



	}else
	if(camControll.action == 'rUp'){

		motions.runned = false;
		motions.lookAtHeigh += motions.dSpeed;
		thatControl.camLookAt.y += motions.dSpeed;
		
	/*	motions.rotateDeg(90);

		motions.rotateVertic( 10 );
		console.log("SECOND  ",motions.rotateAxis.normalize());

	thatControl.camLookAt.x += motions.rotateAxis.x;
	thatControl.camLookAt.y += motions.rotateAxis.y; 
	thatControl.camLookAt.z += motions.rotateAxis.z;
	motions.lookAtHeigh += motions.rotateAxis.y;
*/

	}else
	if(camControll.action == 'rDown'){

		motions.runned = false;
		if(motions.lookAtHeigh >= 0){
			motions.lookAtHeigh -= motions.dSpeed;
			thatControl.camLookAt.y -= motions.dSpeed;
		}




	}else
	if(camControll.action == 'rRight'){

		motions.runned = false;
		motions.rotateDeg(0.5);
		motions.rotateCam();

		
	}else
	if(camControll.action == 'zIN'){
		motions.zoom("in");

	}else
	if(camControll.action == 'zOUT'){
		motions.zoom("out");
	}


};

//move the camera
Motions.prototype.moveCam = function(){


	motions.rotate.normalize().multiplyScalar( motions.dSpeed  );

	thatControl.camera.position.x += motions.rotate.x;
	thatControl.camera.position.z += motions.rotate.z;
	thatControl.camera.position.y += motions.rotate.y;

	thatControl.camLookAt.x += motions.rotate.x;
	thatControl.camLookAt.z += motions.rotate.z;
	thatControl.camLookAt.y += motions.rotate.y;


};

//handle the camera zoom
Motions.prototype.zoom = function(d){
		var cam2 = thatControl.camera.position.clone();
		var lookAt2 = thatControl.camLookAt.clone();


		var vecLength = new THREE.Vector3();
		vecLength.x = lookAt2.x - cam2.x;
		vecLength.y = lookAt2.y - cam2.y;
		vecLength.z = lookAt2.z - cam2.z;


		var zoom = motions.cP.normalize().clone();
		var speed = motions.dSpeed;


		if(d == "out"){
			thatControl.camera.position.x -= zoom.x * speed;
			//thatControl.camera.position.y -= zoom.y * speed;
			thatControl.camera.position.z -= zoom.z * speed;

			thatControl.camLookAt.x -= zoom.x * speed;
			//thatControl.camLookAt.y -= zoom.y * speed;
			thatControl.camLookAt.z -= zoom.z * speed;	 
		}else
		if(d == "in" && vecLength.length() >= 30){
			thatControl.camera.position.x += zoom.x * speed;
			//thatControl.camera.position.y += zoom.y * speed;
			thatControl.camera.position.z += zoom.z * speed;

			thatControl.camLookAt.x += zoom.x * speed;
			//thatControl.camLookAt.y += zoom.y * speed;
			thatControl.camLookAt.z += zoom.z * speed;

		}
	

};
//move lookat point
Motions.prototype.rotateCam = function(){

	thatControl.camLookAt.x = motions.rotate.x + thatControl.camera.position.x;
	thatControl.camLookAt.z = motions.rotate.z + thatControl.camera.position.z;
	//thatControl.camLookAt.y = motions.rotate.y + thatControl.camera.position.y;		

};

//render the compass
Motions.prototype.rendereCompass = function(){

		//this.lookAtDir.x = thatControl.camLookAt.x - thatControl.camera.position.clone());
		
		var c = thatControl.camera.position.clone();
		var l = thatControl.camLookAt.clone();


		this.lookAtDir.x = l.x - c.x;
		this.lookAtDir.y = l.z - c.z;


		

		if(this.tempDirVec.x != this.lookAtDir.x || this.tempDirVec.y != this.lookAtDir.y){

			this.rotateCompass();

		}


		motions.tempDirVec = motions.lookAtDir.clone();

	//	console.log(thatControl.tempPosVec.x , thatControl.camLookAt.x);
	
};

//rotate the compass via CSS
Motions.prototype.rotateCompass = function(){

	motions.lookAtDir.normalize();

	var angleDeg = Math.atan2(motions.lookAtDir.y, motions.lookAtDir.x) * 180 / Math.PI + 90;

	document.getElementById('compassCNTR').style.transform = "rotate("+angleDeg*-1+"deg)";

};


/* OLd ONE
Motions.prototype.animation2 = function(m, btn){



	var cam = thatControl.camera.position.clone();
	var lookAt = thatControl.camLookAt.clone();


	this.cP = new THREE.Vector2();
	this.cP.x = lookAt.x - cam.x;
	this.cP.y = lookAt.z - cam.z;


	this.rotate = {
		"x":0,
		"y":0
	};



	var coords = { x: 0, y: 0, a: 0, ma: 0, lup:0};
	var tween = new TWEEN.Tween(coords)
    .to({ x: 500, y: 500, a: 90, ma:-90, lup: 30}, 1000)
    .onUpdate(function() {





    }).start();

	motions.runned = false;
}
*/