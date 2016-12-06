function ControlHandler(domElem){
	
	thatControl = this;


	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, thatground.terrain.corner["maxXZ"].x+thatground.terrain.corner["maxXZ"].z+10000  );
	if(objLoad.firstElem == ""){
		//this.camera.position.set( thatground.terrain.corner["maxXZ"]["x"]/2, thatground.terrain.corner["maxXZ"]["y"]+15000|0, (thatground.terrain.corner["maxXZ"]["z"]/3)+150000|0);
		this.camera.position.set( 0, thatground.terrain.corner["maxXZ"]["y"]+100000|0, -(thatground.terrain.corner["maxXZ"]["z"]*1.6)|0);
	
	}else{
		this.camera.position.set( objLoad.firstElem.x, objLoad.firstElem.y, objLoad.firstElem.z+3000);
	}
	this.camera.up = new THREE.Vector3(0,1,0);
	this.camera.rotationAutoUpdate = false;
	//this.camera.lookAt (new THREE.Vector3 (0.0, 0.0, 0.0));
	this.camera.updateProjectionMatrix();




	this.tempPosVec = new THREE.Vector3();
	if(objLoad.firstElem == ""){
		//this.camLookAt =  new THREE.Vector3(thatground.terrain.corner["maxXZ"]["x"]/2, thatground.terrain.corner["maxXZ"]["y"], thatground.terrain.corner["maxXZ"]["z"]/2);
		this.camLookAt =  new THREE.Vector3( 0 , 0, 0);
	
	}else{
		this.camLookAt =  new THREE.Vector3(objLoad.firstElem.x, objLoad.firstElem.y+20000 ,objLoad.firstElem.z);
	}
	this.controls = new THREE.OrbitControls( this.camera, domElem );
	//this.controls.damping = 0.2;
	//this.controls = new THREE.TrackballControls( camera , domElem );

											//0.2, 8, 8
	var geometry = new THREE.SphereGeometry( 10 , 32, 32 );
	var material = new THREE.MeshBasicMaterial( {
													color: 0xFFFFFF
												} );
	this.lookAtSphere = new THREE.Mesh( geometry, material );
	
	this.rayTransform = new THREE.Matrix4();
	this.upRay = new THREE.Raycaster();
	this.dwnRay = new THREE.Raycaster();
	//console.log(this.camLookAt);

}


//render The Camera position
ControlHandler.prototype.render = function(){
	//this.getLookAtHight();	
	this.controls.target = this.camLookAt;
	this.lookAtSphere.position.copy(this.camLookAt);

	for(var i = 0; i < this.lines.length; i++){
	//	this.lines[i].position.copy(this.camLookAt);
	}

	
	this.tempPosVec = this.camLookAt.clone();
	this.controls.update();

}
ControlHandler.prototype.getLookAtHight = function(){
		
	
		if(this.tempPosVec.x != this.camLookAt.x || this.tempPosVec.z != this.camLookAt.z){
			
							
			var dirupVec = new THREE.Vector3(0, 1, 0);
			var dirdownVec = new THREE.Vector3(0, -1, 0);
			var orignVec = new THREE.Vector3(0, 0, 0);

			this.upRay.set(orignVec, dirupVec);
			this.dwnRay.set(orignVec, dirdownVec);

			this.rayTransform.set(	1, 0, 0, this.camLookAt.x,
									0, 1, 0, this.camLookAt.y,
									0, 0, 1, this.camLookAt.z,
									0, 0, 0, 1);


			this.upRay.ray.applyMatrix4(this.rayTransform);
			this.dwnRay.ray.applyMatrix4(this.rayTransform);

			var interUp = this.upRay.intersectObject(thatground.terrain.plane, true);
			var interDwn = this.dwnRay.intersectObject(thatground.terrain.plane, true);
			if(interUp.length > 0){
				this.camLookAt.y =  interUp[0].point.y + motions.lookAtHeigh;			
			} 
			if(interDwn.length > 0 ){
				this.camLookAt.y =  interDwn[0].point.y + motions.lookAtHeigh;	
			}
			
			

			
			
		}

		


}






//Draw the X,Y,Z lines for orintation
ControlHandler.prototype.addDirectionslines = function(scene){
	this.lines = new Array();
//------------- X Line
	var material = new THREE.LineBasicMaterial({
		color: 0xFF0000 //red for X

	});

	geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 50, 0, 0 )
	);
	this.lines[0] = new THREE.Line( geometry, material );
//------------- Y Line
	material = new THREE.LineBasicMaterial({
		color: 0x0000FF //blue Y
	});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 200, 0 )
	);

	this.lines[1] = new THREE.Line( geometry, material );
//------------- Z Line
	material = new THREE.LineBasicMaterial({
		color: 0x00CC00 //green Z
	});
	geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 0, 200 )
	);
	this.lines[2] = new THREE.Line( geometry, material );

	for(var i = 0; i < this.lines.length; i++){
		scene.add( this.lines[i] );
	}
}
