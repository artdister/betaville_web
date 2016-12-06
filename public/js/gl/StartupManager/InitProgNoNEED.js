function InitProg(p){
	geoLoad = this;

	this.source = city;
	this.index = 0;

	this.cityobjlength = 0;
	this.dataStats = p.dataStats;
	this.objectsCity = p.cityObjects;
	this.dataset = p.onLoad;

	console.log(p);
	new GeoGround(p.terrainData);
	new ObjectLoader();




	this.citySRC = [];

	for(var k = 0;k < this.dataset.length;k++){

				geoLoad.citySRC.push({	type:this.dataset[k].type,
							src: '../../storage/app/'+this.dataset[k].src,
							data:{
								color:this.dataset[k].data.color,
								width:this.dataset[k].data.width
							},
							index:k
						});




	}
	geoLoad.citySRC.pop();
	new GeoCommentsLoader(geoPosModelloaded);

};

InitProg.prototype.startLoadData = function(){

	loading.unzipHeighmap('../../storage/app/'+this.source['hightmap']);
}


InitProg.prototype.terainLoaded = function() {




	geoLoad.index = geoLoad.citySRC.length;


	if(geoLoad.dataStats == undefined){

		geoLoad.loadDataSet();

	}else{

		loading.loadpipe();
		//thatground.stats.load(city.id,  );

	}

	//
	//geoLoaded();

};


InitProg.prototype.loadDataSet = function(){
	if(geoLoad.index <= geoLoad.citySRC.length-1){


		loadData.check('dataSet',
			function(){

				geoLoad.index++;
				geoLoad.loadDataSet();
			},
			function(){

				loading.progressBar.setAttribute("value", geoLoad.index+1);
				loading.loadingFile.innerHTML = "Loading: "+geoLoad.citySRC[geoLoad.index].type+" : "+geoLoad.citySRC[geoLoad.index].src;

				var dataObj = geoLoad.citySRC[geoLoad.index];

				thatground.city.push( new geoJSONLineLoader(dataObj));

				ajax.get(geoLoad.citySRC[geoLoad.index].src, 'json', onLoadedVector);
			}
		);


	}else if(geoLoad.index < loading.objlength){
		var i = geoLoad.index - geoLoad.citySRC.length;

		if(objLoad.firstElem == ""){



			var wkt = new Wkt.Wkt();
			var latlng = wkt.read(geoLoad.objectsCity[0].position.position);


			var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
			var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");

			objLoad.firstElem = new THREE.Vector3(-newPos.x,pos.y,newPos.z);

		}


		loadData.check('cityobjs',
			function(){



				geoLoad.index++;
				geoLoad.loadDataSet();

			},
			function(){

					if(geoLoad.objectsCity[i]){
						loading.progressBar.setAttribute("value", geoLoad.index+1);
						loading.loadingFile.innerHTML = "Loading Object:  "+geoLoad.objectsCity[i].name;
						objLoad.loadObj(geoLoad.objectsCity[i], cityObjLoaded);
					}else{

						geoLoad.index++;
						geoLoad.loadDataSet();
					}



			}
		);

	}


	else if(geoLoad.index == loading.objlength){

		loading.progressBar.style.display = "none";
		loading.loadingFile.style.display = "none";
		geoLoaded();

	}



};

InitProg.prototype.loadingbar = function(){


};


function LoadingDataHelper(data){
	console.log(data);
	this.keys = new Array();
	this.data = data;

	if(data != "null"){

		for(key in data){
			this.keys.push(key);
		}


	}else{

		console.warn("Data picker is null");
	}
	//console.log(this.keys);


};
LoadingDataHelper.prototype.check = function(name, action, altaction){

	if(this.data != null){

		for(var i = 0;i < this.keys.length;i++){

			if(name == this.keys[i]){

				if(this.data[this.keys[i]] == "false"){
					return action();
				}else{
					return altaction();
				}
			}
		}

	}else{
		//here goes the code for landingpage lading
		return altaction();
	}


};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
