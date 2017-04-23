/*
*	prepare the data and start loading it on the loading screen
*/function preLoad(){

	preLoad = this;
	this.manager = new THREE.LoadingManager();
	this.progressBar = document.createElement("PROGRESS");
	this.progressBar.setAttribute("value", 0);
	this.loadingFile = document.createElement("p");
	this.proposals = new Array();
	this.geopositions = new Array();
	this.buildingsJSON = 0;
	ajax.get('../../storage/app/'+loadingData['city']['dataset'],'json', function(e){

		preLoad.onLoadDataSet = JSON.parse(e);

		new GeoGround(preLoad.onLoadDataSet);
		new ObjectLoader();

		preLoad.pipe = preLoad.createPipe(preLoad.onLoadDataSet.onLoad);


		var loadingContainer = document.getElementById("container");
		loadingContainer.appendChild(preLoad.loadingFile);
		loadingContainer.appendChild(preLoad.progressBar);
		preLoad.progressBar.setAttribute("max" , preLoad.pipe.length-1);
		preLoad.loadingFile.innerHTML = "Loading: "+preLoad.pipe[0].name;




		preLoad.loadTerrain(preLoad.pipe[0]);


	});



}
//merge the data to a pipe which is loading during the loading screen
preLoad.prototype.createPipe = function(json){

	var pipe = new Array();
	var out = new Array();
	var ld = loadingData['loadData']['data'];
	var models = loadingData["models"];




	for(var k in ld){
		//check if Terrain need to load
		if(k == "terrain"){
			pipe.push({
				'name': k,
				'type': 'terrain',
				'src': loadingData["city"].hightmap

			});
		}

		//check the geoData.json if need to load
		for(var i = 0; i < json.length; i++){
			if(json[i].name == k && ld[k] == "true"){
				pipe.push({
					'name': k,
					'type': 'dataset',
					'src': json[i].src

				});
			}

		}

		//check if models need to load
		if(k == "cityobjs" && getSize(models) > 0){

			//buildings high defin.
			if( models.buildings.high ){
				for(var i = 0; i < models.buildings.high.length; i++ ){
						pipe.push({
						'name': k,
						'type': 'buildingsHigh',
						'data': models.buildings.high[i]

					});

				}
			}
			//buildings low defin.
			if( models.buildings.low ){
				for(var i = 0; i < models.buildings.low.length; i++ ){
						pipe.push({
						'name': k,
						'type': 'buildingsLow',
						'data': models.buildings.low[i]

					});

				}
			}
			//proposals
			for(var i = 0; i < models.proposals.length; i++ ){
					this.proposals.push({
					'name': k,
					'type': 'proposal',
					'data': models.proposals[i]

				});

			}
			//geopositons
			for(var i = 0; i < models.geopositions.length; i++ ){
					this.geopositions.push({
					'name': k,
					'type': 'geoposition',
					'data': models.geopositions[i]

				});

			}


		}

	}
	//sort pipe by adding entrys to new array
	for(var i = 0; i < pipe.length;i++){
		if(pipe[i].type == 'terrain'){
			out.push(pipe[i]);
		}

	}
	for(var i = 0; i < pipe.length;i++){
		if(pipe[i].type == "dataset"){
			out.push(pipe[i]);

		}

	}
	for(var i = 0; i < pipe.length;i++){
		if(pipe[i].type == 'buildingsHigh' ||
			pipe[i].type == 'buildingsLow' ||
				pipe[i].type == 'proposal' ||
					pipe[i].type == 'geoposition' ){

			out.push(pipe[i]);
		}

	}

	return out;

}

//load the terrain
preLoad.prototype.loadTerrain = function(elem){


	JSZipUtils.getBinaryContent('../../storage/app/'+elem.src, function(err,file){
		if(getSize(err) != 0){

			console.log(err);

		}else{
			var zip = new JSZip(file);
			var objData = zip.file(loadingData['city'].name.toLowerCase()+".xyz").asText();
			thatground.terrain.load(objData, preLoad.initDataSetLoad);
		}



	})

}

//load the vector data
preLoad.prototype.initDataSetLoad = function(){

	preLoad.dsArray = new Array();
	preLoad.index = 0;

	for(var i = 0; i < preLoad.onLoadDataSet.onLoad.length; i++){
		for(key in loadingData['loadData']['data']){
			if(preLoad.onLoadDataSet.onLoad[i].name == key && loadingData['loadData']['data'][key] == "true"){

				preLoad.dsArray.push(preLoad.onLoadDataSet.onLoad[i]);
			}


		}

	}

	ajax.get('../cities/getDatamap/'+loadingData.city.id,
	'json',
	function(e){

		var json = JSON.parse(e);

		for(var i = 0; i < json.length;i++){


			preLoad.loadingFile.innerHTML = "Loading: "+json[i].name;
			ajax.get('../cities/getDatasetGeomByID/'+json[i].id,
				'json',
				function(geom){
					var elem = JSON.parse(geom);
			
					ajax.get('../../storage/app/'+json[i].dataSet,
						'json',
						function(ds){
							var ds = JSON.parse(ds);
							for(var j = 0; j < elem.length;j++){

								var geoData = JSON.parse(elem[j].geom);
								//var prop = elem[j]['properties'];
								
								if(geoData.type == 'LineString' || geoData.type == 'MultiLineString'){
							
									thatground.lines.widthData = ds.width;	
									thatground.lines.color = ds.color;
									thatground.lines.loadJSONfromDB(geoData, elem[j].type);


								}else
								if(geoData.type == 'Polygon' || geoData.type == 'MultiPolygon'){
									//console.log(geoData);
								
									thatground.objects.loadFromDB(geoData, ds, parseInt(elem[j].height));
									

								}else
								if(geoData.type == 'Point' || geoData.type == 'MultiPoint'){
									console.log("Point");
								}
							

							}
								
							thatground.lines.createMesh();
							thatground.objects.createMeshFromMainGeom();

						})



					
				});

			
		}
		//console.log(JSON.parse(e) );
		
	});

			



	preLoad.loadDataSet();


}

//load the data from the dataset.json
preLoad.prototype.loadDataSet = function(){
	if(preLoad.index <= preLoad.dsArray.length-1){

		var pbvalue = parseFloat(preLoad.progressBar.getAttribute('value'))+1;
		preLoad.progressBar.value = pbvalue;
		preLoad.loadingFile.innerHTML = "Loading: "+preLoad.dsArray[preLoad.index].name;
	

		if(preLoad.dsArray[preLoad.index].type == 'vector'){

			thatground.city.push( new geoJSONLineLoader(preLoad.dsArray[preLoad.index]));
			ajax.get('../../storage/app/'+preLoad.dsArray[preLoad.index].src, 'json', onLoadedVector);
		}else
		if(preLoad.dsArray[preLoad.index].type == 'buildings'){
		
			preLoad.buildingsJSON++
			preLoad.buildOBJ =  new geoObjectLoader();
			thatground.buildings.push( preLoad.buildOBJ );
			ajax.get('../../storage/app/'+preLoad.dsArray[preLoad.index].src, 'json', onLoadedBuildings);

		}else
		if(preLoad.dsArray[preLoad.index].type == 'points'){
			
			thatground.city.push( new geoPointsLoader(preLoad.dsArray[preLoad.index]));
			ajax.get('../../storage/app/'+preLoad.dsArray[preLoad.index].src, 'json', onLoadedPoints);
		}


	}else{
		preLoad.initModelLoad();

	}
}
//prepare to load the buildings
preLoad.prototype.initModelLoad = function(){

	preLoad.moArray = new Array();
	preLoad.moArray['hd' ] = new Array();
	preLoad.moArray['ld'] = new Array();
	preLoad.indexHD = 0;
	preLoad.indexLD = 0;


	for(var i = 0; i < preLoad.pipe.length;i++){
		if(preLoad.pipe[i].type == 'buildingsHigh'){

			preLoad.moArray['hd' ].push(preLoad.pipe[i]);

		}
		if(preLoad.pipe[i].type == 'buildingsLow'){
			preLoad.moArray['ld' ].push(preLoad.pipe[i]);

		}
	}

	if(preLoad.moArray['hd' ].length > 0){

		var wkt = new Wkt.Wkt();
		var latlng = wkt.read(preLoad.moArray['hd' ][0].data.position);


		var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
        var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");
		objLoad.firstElem = new THREE.Vector3(	newPos.x, 
												newPos.y , 
												newPos.z );
	}


	if(preLoad.moArray['ld'].length > 0){

		preLoad.loadLDModels();

	}else{
		preLoad.loadHDModels();
	}


}

//load low def. models (vector buildings)
preLoad.prototype.loadLDModels = function(){

	preLoad.buildingsLow =  new geoObjectLoader();
	for(var i = 0; i < preLoad.moArray['ld'].length;i++){



			var pbvalue = parseFloat(preLoad.progressBar.getAttribute('value'))+1;
			preLoad.progressBar.value = pbvalue;
			preLoad.loadingFile.innerHTML = "Loading: "+preLoad.moArray['ld' ][preLoad.indexLD].data.name;


			preLoad.buildingsLow.loadFromDB(preLoad.moArray['ld'] [i].data);



	}

	preLoad.buildingsLow.createMeshFromMainGeom();
	preLoad.loadHDModels();


}

//load high def. models (collada buildings)
preLoad.prototype.loadHDModels = function(){

	if(preLoad.indexHD <= preLoad.moArray['hd' ].length-1){

		var pbvalue = parseFloat(preLoad.progressBar.getAttribute('value'))+1;
		preLoad.progressBar.value = pbvalue;
		preLoad.loadingFile.innerHTML = "Loading: "+preLoad.moArray['hd' ][preLoad.indexHD].data.name;


		objLoad.loadObj(preLoad.moArray['hd' ][preLoad.indexHD].data, cityObjLoaded);

	}else{

		preLoad.progressBar.style.display = "none";
		preLoad.loadingFile.style.display = "none";
		new GeoCommentsLoader(geoLoaded);


	}

}

//add keyboard handlings
preLoad.prototype.addWindowEvent = function(){

	window.addEventListener("dragover",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener( 'keydown', function ( event ) {

			switch ( event.keyCode ) {

				case 81: // Q
					thisCore.control.setSpace( thisCore.control.space === "local" ? "world" : "local" );
					break;

				case 87: // W
					thisCore.control.setMode( "translate" );
					break;

				case 69: // E
					thisCore.control.setMode( "rotate" );
					break;

				case 82: // R
					thisCore.control.setMode( "scale" );
					break;

				case 187:
				case 107: // +, =, num+
					thisCore.control.setSize( thisCore.control.size + 0.1 );
					break;

				case 189:
				case 109: // -, _, num-
					thisCore.control.setSize( Math.max( thisCore.control.size - 0.1, 0.1 ) );
					break;

			}
	});
};
