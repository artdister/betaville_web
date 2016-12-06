function Light(){

/*	this.hemiLight = new THREE.HemisphereLight( 0x3399FF, 0xffff00, 1 );
	this.hemiLight.color.setHSL( 1, 1, 1 );
	this.hemiLight.groundColor.setHSL( 1, 1, 1 );
	this.hemiLight.position.set( 0, 100, 0 );
	this.hemiLight.shadowCameraVisible = true;*/



	lightLib = this;


	this.skySphereSize = Math.sqrt(Math.pow(thatground.terrain.corner["maxXZ"].x,2) + Math.pow(thatground.terrain.corner["maxXZ"].z,2))
	if(this.skySphereSize < 0){
		this.skySphereSize = this.skySphereSize*(-1);
	}

	this.sky = new THREE.Sky(this.skySphereSize);
	this.sunpoint = new THREE.Vector3();
	this.sunTempPos = new THREE.Vector3();
	this.shadowlightisOn = true;

	this.sky.uniforms.turbidity.value = 17;
	this.sky.uniforms.reileigh.value = 2;
	this.sky.uniforms.luminance.value = 1;
	this.sky.uniforms.mieCoefficient.value = 0.001;
	this.sky.uniforms.mieDirectionalG.value = 0.9;
/*
	this.sky.mesh.position.set(
				thatground.terrain.corner["maxXZ"].x/2,
				0,
				thatground.terrain.corner["maxXZ"].z/2);
*/		

 






		this.hemiLight = new THREE.HemisphereLight( 0xA6A6FF, 0x00000, 1.5);
       	this.hemiLight.color.setHSL( 0.0, 0.0, 0.75 );

		
			

        
           



			this.shadowLight = new THREE.DirectionalLight( 0x00000, 0.5);
			this.shadowLight.position.set(this.sunpoint.x, this.sunpoint.y, this.sunpoint.z);
			this.shadowLight.target.position.set(thatground.terrain.corner["maxXZ"].x/2, 
													0,
													thatground.terrain.corner["maxXZ"].z/2);
			//this.shadowLight.onlyShadow = true;
			this.shadowLight.name = "shadowLight";
			this.shadowLight.castShadow = true;

			this.shadowLight.shadowDarkness = 0.7;
			//this.shadowLight.shadowCameraFov = 2;
			this.shadowLight.shadowCameraNear = 0.0001;
			this.shadowLight.shadowCameraFar = this.skySphereSize;

			var sc = 2048; //this.skySphereSize*2;
			this.shadowLight.shadowCameraLeft = -sc*3;
			this.shadowLight.shadowCameraRight = sc*3;
			this.shadowLight.shadowCameraTop = sc;
			this.shadowLight.shadowCameraBottom = -sc;

			this.shadowLight.shadowBias = -0.0004;

			this.shadowLight.shadowMapWidth = this.shadowLight.shadowMapHeight = 2048;
		



			this.shadowlightHelper =  new THREE.DirectionalLightHelper(this.shadowLight, 1);
    
    		this.shadowlightHelper.update();


    		
				


}

Light.prototype.calcSunPos = function(){


		var maxpos = thisCore.scaleTerrainTocoord(new THREE.Vector3(thatground.terrain.corner["maxXZ"].x/2,0,thatground.terrain.corner["maxXZ"].z/2));
	  	var time = new Date();
	  	

	  	var h = parseInt(thatTopMenuBar.timeLine.value)-1;
	  	time.setHours(h,0,0,0);

	  	
		var sunPos = SunCalc.getPosition(time, maxpos.z, maxpos.x);

		lightLib.sunpoint.set(	
								Math.sin(sunPos.azimuth) * Math.cos(sunPos.altitude) , 
								-Math.sin(sunPos.altitude) ,
								-Math.cos(sunPos.azimuth) * Math.sin(sunPos.altitude) ).multiplyScalar(10000) ;

	/*

	
		var maxpos = thisCore.scaleTerrainTocoord(thatground.terrain.corner["maxXZ"]);
		//get Center of the Geo ground Plane
		maxpos.x = maxpos.x/2;
		maxpos.z = maxpos.z/2
		
	  	var time = new Date();
	  	var h = thatTopMenuBar.timeLine.value-1;
	  	time.setHours(h,0,0,0);
		var sunPos = SunCalc.getPosition(time, maxpos.x, maxpos.z);
		lightLib.sunpoint.set(Math.sin(sunPos.azimuth), Math.sin(sunPos.altitude), (thatground.worldSection.x)*Math.cos(sunPos.azimuth)).multiplyScalar(10000);
		*/
		//turn Light off if y < 0 for no shadows from negative
		if(lightLib.sunpoint.y >= 0 && lightLib.shadowlightisOn == true){
			lightLib.shadowLight.intensity = 0;
			lightLib.shadowLight.shadow.darkness = 0;
			lightLib.shadowlightisOn = false;

			for(var i = 0; i < thatground.city.length;i++){
			/*	if(thatground.city[i].plane.userData.type == 'roads'){
					var plane = thatground.city[i].plane.material.color;
					plane.setRGB(0.1, 0.1, 0);
					thisCore.scene.fog = new THREE.Fog( 0xFFFF00, 0, 100000 );
					this.hemiLight.intensity = 0.5;
				}
			*/		
			}
			

		}else if(lightLib.sunpoint.y < 0){
			lightLib.shadowLight.intensity = 1;
			lightLib.shadowLight.shadow.darkness = 0.7;
			lightLib.shadowlightisOn = true;

			for(var i = 0; i < thatground.city.length;i++){
			//	if(thatground.city[i].plane.userData.type == 'roads'){
					//var plane = thatground.city[i].plane.material.color;
					//plane.setRGB(thatground.city[i].plane.userData.defMat.color);
					//thisCore.scene.fog = new THREE.Fog( 0x000000, 0.1, 100000 );
					//this.hemiLight.intensity = 1.5;
			//	}
					
			}
		}





		thatTopMenuBar.timelineOut.innerHTML = h+":00 "+'GMT:'+time.getTimezoneOffset() /60 ;
		var shaderSunPos = new THREE.Vector3();
		shaderSunPos.set(	-lightLib.sunpoint.x * (this.skySphereSize/2), 
							lightLib.sunpoint.y * -(this.skySphereSize/2), 
							-lightLib.sunpoint.z * (this.skySphereSize/2)
							);

		lightLib.sky.uniforms.sunPosition.value = (shaderSunPos);
		if(lightLib.shadowlightisOn == true){
			lightLib.hemiLight.position.set(shaderSunPos.x, shaderSunPos.y, shaderSunPos.z);
			lightLib.hemiLight.updateMatrix();			
		}

}
Light.prototype.render = function(){
	 this.shadowlightHelper.update();

	if(this.shadowLight.target.position.x != thatControl.camLookAt.x || this.shadowLight.target.position.z != thatControl.camLookAt.z){
		this.shadowLight.target.position.set(thatControl.camLookAt.x,thatControl.camLookAt.y,thatControl.camLookAt.z);
		thisCore.scene.add(this.shadowLight.target);
	}
	
	if(thatControl.camLookAt.x != this.sunTempPos.x || thatControl.camLookAt.y != this.sunTempPos.y || thatControl.camLookAt.z != this.sunTempPos.z){

		this.shadowLight.position.set(parseFloat(thatControl.camLookAt.x) - parseFloat(this.sunpoint.x),
											parseFloat(thatControl.camLookAt.y) - parseFloat(this.sunpoint.y),
												parseFloat(thatControl.camLookAt.z) - parseFloat(this.sunpoint.z));
		this.sunTempPos.set(thatControl.camLookAt.clone());
	}
	
	this.shadowLight.updateMatrixWorld();
	//this.shadowLight.target.updateMatrixWorld();
	
	this.shadowLight.updateMatrix();
   	  //	this.shadowLight.target.updateMatrix();
}