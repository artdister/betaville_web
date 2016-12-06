function LeafLetMap(bbox, plane){
	thatMap = this;
	this.bbox = bbox;

	this.progressBar = new ProgressBar();

	this.keyListULLines = $('#mapKeysLines UL');
	this.keyListULPolygons = $('#mapKeysPolygons UL');
	this.keyListULPoints = $('#mapKeysPoints UL');

	this.keyWordLines = $('#searchforKeyTextLines');
	this.keyWordPolygons = $('#searchforKeyTextPolygons');
	this.keyWordPoints = $('#searchforKeyTextPoints');

	this.geoDataObj = {
		'color':"rgb(100,100,100)",
		'width':{}
	};


	this.polygonRadioBtn = document.calcPolygonType.calcPolygonRadio;
	this.prBTNselect = 'area';
	for(var r = 0; r < this.polygonRadioBtn.length;r++){

		this.polygonRadioBtn[r].onclick = function(e){

			thatMap.prBTNselect = this.value;


			thatMap.keyListULPolygons.empty();


			thatMap.uploadGeom = L.geoJson(false, {
                style: thatMap.myStyle,
            });

			L.geoJson(thatMap.geoJSON, {
                onEachFeature: thatMap.onEachFeature
            });
			console.log(thatMap.uploadGeom.toGeoJSON());
			//console.log(thatMap.prBTNselect);
		}


	}

	//webGL THREEJS settings 
	this.scene = new THREE.Scene();
	this.container = document.getElementById( 'glPreView' );
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	this.container.appendChild( this.renderer.domElement );
	this.camera = new THREE.PerspectiveCamera( 45, this.container.clientWidth/this.container.clientHeight, 0.01, 2000000 );
	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );



	this.scene.add(plane);

	var geometry = plane.geometry;
	geometry.computeBoundingBox();
	boundingBox = geometry.boundingBox;

	var x0 = boundingBox.min.x;
	var x1 = boundingBox.max.x;
	var y0 = boundingBox.min.y;
	var y1 = boundingBox.max.y;
	var z0 = boundingBox.min.z;
	var z1 = boundingBox.max.z;


    var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
    var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
    var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

    var centroidX = x0 + ( bWidth / 2 );
    var centroidY = y0 + ( bHeight / 2 );
    var centroidZ = z0 + ( bDepth / 2 );

    this.cpolygon = 0;
    this.clines = 0;
    this.cpoints = 0;



	this.camera.position.set(  centroidX, centroidY+8000, 0 );
	this.controls.target =  new THREE.Vector3(centroidX, centroidY, centroidZ)



	// set up the Leaflet Map
	this.map = new L.Map('mapPreView');
	
	this.myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };




	this.uploadGeom = L.geoJson(false, {
                style: thatMap.myStyle,
            });



	this.drawGeom = L.canvasTiles()
                      .params({ debug: false, padding: 0 })
                      .drawing(thatMap.drawingOnCanvas);




    this.drawGeom.addTo(this.map);

    this.geoJSON = "";

	// create the tile layer with correct attribution
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib});       

	// start the map in South-East England
	this.map.setView(new L.LatLng(this.bbox[0], this.bbox[1]),9);

	var bounds = L.latLngBounds([
	    L.latLng(this.bbox[0], this.bbox[1]),
	    L.latLng(this.bbox[2], this.bbox[3])
	]);

	this.map.fitBounds(bounds);//works!


	this.map.addLayer(osm);                 


	var bounds = [[bbox[0], bbox[1]], [bbox[2], bbox[3]]];
	var rect = L.rectangle(bounds, {color: 'blue', weight: 1}).on('click', function (e) {
	    // There event is event object
	    // there e.type === 'click'
	    // there e.lanlng === L.LatLng on map
	    // there e.target.getLatLngs() - your rectangle coordinates
	    // but e.target !== rect
	    console.info(e);
	}).addTo(this.map);

	thatMap.animate();

};
LeafLetMap.prototype.findKey = function(e){



	this.keyListULLines.empty();
	this.keyListULPolygons.empty();
	this.keyListULPoints.empty();

	this.geoDataObj.width = {};
	this.geoDataObj.height = {};

	thatMap.uploadGeom = L.geoJson(false, {
                style: thatMap.myStyle,
            });

	L.geoJson(this.geoJSON, {
                onEachFeature: thatMap.onEachFeature
            });
	//console.log(thatMap.uploadGeom.toGeoJSON());
	thatMap.reloadgeoData();
};


LeafLetMap.prototype.resetUploadLayer = function(){

         	


	this.map.removeLayer(this.uploadGeom);
	this.uploadGeom = L.geoJson(false, {
                style: thatMap.myStyle,
            });

};

LeafLetMap.prototype.addToMap = function(geoJSON) {
			
			this.geoDataObj = {
				'color':"rgb(100,100,100)",
				'width':{}
			};



			this.layerIndex = 0;
   			thatMap.resetUploadLayer();


   			this.geoJSON = geoJSON;
   			this.geoJSONKey = document.getElementById('osmopText').value;

   			this.keyWordLines.val(this.geoJSONKey);
   			this.keyWordPolygons.val('height');
   			this.keyWordPoints.val(this.geoJSONKey);



   			var tileOptions = {
	            maxZoom: 20,  // max zoom to preserve detail on
	            tolerance: 5, // simplification tolerance (higher means simpler)
	            extent: 4096, // tile extent (both width and height)
	            buffer: 64,   // tile buffer on each side
	            debug: 0,      // logging level (0 to disable, 1 or 2)

	            indexMaxZoom: 0,        // max zoom in the initial tile index
	            indexMaxPoints: 100000, // max number of points per tile in the index
	        };


   			thatMap.tileIndex = geojsonvt(geoJSON, tileOptions);

   			thatMap.drawGeom.redraw();

   			thatMap.uploadGeom = L.geoJson(false, {
                style: thatMap.myStyle,
            });

           	L.geoJson(this.geoJSON, {
                onEachFeature: thatMap.onEachFeature
            });

           	console.log(thatMap.uploadGeom.toGeoJSON(),'-----------------------------------' );
           	thatMap.reloadgeoData();

           

           	console.log("polygons: ", thatMap.cpolygon,  "lines:",thatMap.clines,  "points: ",thatMap.cpoints);


            document.getElementById('calchighBTN').disabled = false;

            this.progressBar.hide();
};

LeafLetMap.prototype.addToMapFromDB = function(id){
	//var id = elem.parentNode.getAttribute('elemid');
	thatMap.progressBar.show();
    thatMap.progressBar.showMSG("loading", 100);
	//need Ajax call here!!!
	 $.ajax({
	 	url:'./cities/getDatasetGeomByID/'+id,
	 	success:function(e){
	 		thatMap.resetUploadLayer();

	 		var json = {"type" : "FeatureCollection" , "features" : [] };
	 		
	 		for(var i = 0; i < e.length; i++){

	 				var elem = {"geometry" : JSON.parse(e[i].geom), "properties" : {}, "type": "Feature"};

	 				json.features.push( elem );	
	 			
	 			

	 		}
	 		//console.log(json);
	 	
	 		thatMap.tileIndex = geojsonvt(json);

	 		
   			thatMap.drawGeom.redraw();

   			thatMap.progressBar.hide();

	 	}
	 });
	
};

LeafLetMap.prototype.removeFromDB = function(id){


	$.ajax({
	 	url:'./cities/removeDatasetByID/'+id,
	 	type:"GET",
	 	success:function(e){
	 

			var lis = document.getElementById('dbDatasetList').children[1].children;


			for(var i=0; i < lis.length; i++) {
				var id = lis[i].getAttribute('elemID');
				if(id == e){
				
					lis[i].parentNode.removeChild(lis[i]);
				}
				
			}


	 	}
	 });

};


LeafLetMap.prototype.reloadgeoData = function(){

	var lines = thatMap.keyListULLines[0].childNodes;

	for(var i = 0; i < lines.length;i++){
		var elem = lines[i].childNodes[0].childNodes[0].data;
		var value = lines[i].childNodes[1].value;

		thatMap.geoDataObj.width[elem] = value;
	}
	
	this.geoDataObj.height


};


LeafLetMap.prototype.addToLinesKeyList = function(elem){

	if(thatMap.keyListULLines.children().length == 0){

		var doublefound = false;

	}else{

		var doublefound = false;

		for(var i = 0; i < thatMap.keyListULLines.children().length; i++){
			
			if(thatMap.keyListULLines.children()[i].childNodes[0].innerHTML == elem){

				doublefound = true;
				break;
			}

		}



	}
	if(doublefound == false && typeof(elem) != 'undefined'){

		var li = document.createElement("li");
		//li.value = elem;
		//li.appendChild(document.createTextNode(elem));
		

		var p = document.createElement("p");
		var node = document.createTextNode(elem);
		p.appendChild(node);
		li.appendChild(p);

	
		var input = document.createElement("input");
		input.type = "text";
		input.value = "width";
		li.appendChild(input); // put it into the DOM

		thatMap.keyListULLines.append(li);	

	
	}

};
LeafLetMap.prototype.addToPolygonKeyList = function(elem, type){

	if(typeof(elem['name']) != 'undefined'){


		var li = document.createElement("li");
	
		//li.appendChild(document.createTextNode(elem['name']+"     "));

		var p = document.createElement("p");
		var node = document.createTextNode(elem['name']);
		p.appendChild(node);

		li.appendChild(p);

		var height = 0;
	
		if(typeof(elem[type]) == 'string' ){
			height = elem[type];
		}

		var input = document.createElement("input");
		input.type = "text";
		input.value = height;
		li.appendChild(input); // put it into the DOM



		thatMap.keyListULPolygons.append(li);	


	}
		
	if(elem['name'] == ''){

	}
};
LeafLetMap.prototype.addToPointsKeyList = function(elem){
	console.log(elem, thatMap.keyWordPoints.val());
	this.keyListULPoints = $('#mapKeysPoints UL');

};

LeafLetMap.prototype.onEachFeature = function(feature, layer) {

    // does this feature have a property named popupContent?

 	if(feature.geometry.type == "Polygon" || feature.geometry.type == "MultiPolygon"){
 		thatMap.cpolygon++;

 		if(thatMap.prBTNselect == 'area'){
 			var center = layer.getBounds().getCenter();
 			thatMap.loadPolygonArea(feature, center);
 		}else
 		if(thatMap.prBTNselect == 'points'){
 			thatMap.loadPolygonPoints(feature);

 		}


 		thatMap.addToPolygonKeyList(feature.properties.tags, thatMap.keyWordPolygons.val());
 
 	}


 	else 
 	if(feature.geometry.type == "LineString"){
 		thatMap.clines++;
 		thatMap.loadLineString(feature);

 		thatMap.addToLinesKeyList(feature.properties.tags[thatMap.keyWordLines.val() ]);


 	}else
 	if(feature.geometry.type == "Point"){

 		thatMap.cpoints++;
 		thatMap.loadPoint(feature);
 		thatMap.addToPointsKeyList(feature.properties.tags);
	}


    
    thatMap.progressBar.showMSG("", 0);

    thatMap.layerIndex++;


};
LeafLetMap.prototype.loadPolygonArea = function(f, center){

	var h = thatMap.calcHighs( center.lat, center.lng );
	//console.log(center, h);
	if(typeof(h) == 'number'){
		for(var i = 0; i < f.geometry.coordinates.length;i++){	
			var elem = f.geometry.coordinates[i];
			for(var j = 0;j < elem.length;j++){

				elem[j][2] = ( h );

			}

				
	   	}
		thatMap.uploadGeom.addData(f);
	}
   	


}

LeafLetMap.prototype.loadPolygonPoints = function(f){

	var tempH = 0;

	for(var j = 0; j < f.geometry.coordinates.length;j++){


		for(var i = 0; i < f.geometry.coordinates[j].length;i++){	
		//	console.log(f.geometry.coordinates[i]);
			
				var elem = f.geometry.coordinates[j][i];


				
				var h = thatMap.calcHighs(elem[1], elem[0]);

				
				elem[2] = ( h );
					



				
		
	   		
	   	}
	}

   	thatMap.uploadGeom.addData(f);
}

LeafLetMap.prototype.loadLineString = function(f){
	var tempH = 0;

	for(var i = 0; i < f.geometry.coordinates.length;i++){	
	//	console.log(f.geometry.coordinates[i]);
		
			var elem = f.geometry.coordinates[i];


		
			var h = thatMap.calcHighs(elem[1], elem[0]);
			
			if(typeof(h) == "number"){
			
				elem.push( h/10 );

			}else{
	
				//f.geometry.coordinates.splice(i, 1);
			}


			
	
   		
   	}
   	thatMap.uploadGeom.addData(f);

};
LeafLetMap.prototype.loadPoint = function(f){




};


LeafLetMap.prototype.calcHighs = function(lat, lng){

	// Here goes the GL calculation
	//console.log(this.drawnGeom);
 
	var pos = merc.px( [ lng, lat ] , thatground.worldScale);

	var newX = (pos[0] - thatground.transformToOrigin.x);
	var newZ = (pos[1] - thatground.transformToOrigin.z);


	var geometry = new THREE.SphereGeometry( 100, 4, 4 ); 
	var material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
	var sphere = new THREE.Mesh( geometry, material ); 


	sphere.position.setX( newX );
	
	var h = thatground.getHight([ newX, newZ ]);
	if(h == 0){
		sphere.position.setY(-2000);
	}else{
		sphere.position.setY(h);
	}
	//console.log(h);


	
	sphere.position.setZ( newZ );

	thatMap.scene.add( sphere.clone() );





	return h;

};
LeafLetMap.prototype.drawingOnCanvas = function(canvasOverlay, params) {
	//thx @ http://bl.ocks.org/Sumbera/c67e5551b21c68dc8299
            var bounds = params.bounds;
            params.tilePoint.z = params.zoom;

            var ctx = params.canvas.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            var pad = 0;
            var ratio = 1;

           // console.log('getting tile z' + params.tilePoint.z + '-' + params.tilePoint.x + '-' + params.tilePoint.y);
           	if(thatMap.tileIndex){

	            var tile = thatMap.tileIndex.getTile(params.tilePoint.z, params.tilePoint.x, params.tilePoint.y);
	            if (!tile) {
	                return;
	            }

	            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);

	            var features = tile.features;

	            ctx.strokeStyle = 'red';


	            for (var i = 0; i < features.length; i++) {
	                var feature = features[i],
	                    type = feature.type;

	                ctx.fillStyle = feature.tags.color ? feature.tags.color : 'rgba(255,0,0,0.05)';
	                ctx.beginPath();

	                for (var j = 0; j < feature.geometry.length; j++) {
	                    var geom = feature.geometry[j];

	                    if (type === 1) {
	                        ctx.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
	                        continue;
	                    }

	                    for (var k = 0; k < geom.length; k++) {
	                        var p = geom[k];
	                        var extent = 4096;
	                       
	                        var x = p[0] / extent * 256;
	                        var y = p[1] / extent * 256;
	                        if (k) ctx.lineTo(x  + pad, y   + pad);
	                        else ctx.moveTo(x  + pad, y  + pad);
	                    }
	                }

	                if (type === 3 || type === 1) ctx.fill('evenodd');
	                ctx.stroke();
	            }
	        }
        };
LeafLetMap.prototype.animate = function() {


	requestAnimationFrame( thatMap.animate );

	thatMap.renderGL();
	
}
LeafLetMap.prototype.renderGL = function() {

	thatMap.scene.updateMatrixWorld();

	thatMap.renderer.render( thatMap.scene, thatMap.camera );

	thatMap.controls.update();

	thatMap.camera.updateProjectionMatrix();



};
