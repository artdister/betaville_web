/*
*	manage the loading of location pins
*/
function GeoCommentsLoader (cb){
	thatGeoComments = this;
	this.geometry = new THREE.Geometry();
	this.geoCommentArray = Array();	
	var loader = new THREE.ColladaLoader();
	this.highlightGeoPosition = "";
	this.defColor = "rgb(102,204,255)";
	this.hoverMaterialColor = "rgb(153, 255, 255)";
	this.pickedMaterialColor = "rgb(255,255,255)";

	//load the location pin model
	loader.load('../../storage/app/geoData/Objects/commentFlag01.dae',function(dae){

		var obj = dae.scene;

		
		var mats = new Array();

		obj.traverse(function(child){

				if(child instanceof THREE.Mesh){
					var objElem = child.clone();



				if(objElem.geometry.type == "BufferGeometry"){
					var geometry2 = new THREE.Geometry().fromBufferGeometry( objElem.geometry );
					thatGeoComments.geometry.merge(geometry2, objElem.matrix );

				}else if(objElem.geometry.type == "Geometry"){
					thatGeoComments.geometry.merge(objElem.geometry, objElem.matrix);

				}

				objElem.updateMatrixWorld( true );	

				}
		})

		thatGeoComments.geometry.computeBoundingBox();
		thatGeoComments.geometry.center();


		//objLoad.totalGeometry.merge(geometry, object3D.matrix);

		
		cb();
	})
};

//change location pin color on user select
GeoCommentsLoader.prototype.renderHightlightGeoPosition = function(obj){

	if( thatRay.pickedGeoObject == ""){
		
		if(obj == ""){
			if(this.highlightGeoPosition != ""){

				this.highlightGeoPosition.material.color.set(this.defColor); 
			}
			
			this.highlightGeoPosition = "";
			return;
		}else{

			if(this.highlightGeoPosition == ""){
				
				this.highlightGeoPosition = obj;
				this.highlightGeoPosition.material.color.set(this.hoverMaterialColor); 
			}
		}

	}


}

//add comments to scene on location pin select
GeoCommentsLoader.prototype.addGeoCommentToScene = function(obj){

	var wkt = new Wkt.Wkt();

	var latlng = wkt.read(obj.position);

	var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
	var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");


	var material = new THREE.MeshBasicMaterial( {color:this.defColor} );
	var geoCommentsObj = new THREE.Mesh(thatGeoComments.geometry, material);
	geoCommentsObj.scale.set(2,2,2);

	geoCommentsObj.name = name;

	geoCommentsObj.updateMatrix();
	


	var total = geoCommentsObj.clone();
	total.name = obj.name;
	total.userData = {id:obj.id};
	total.applyMatrix(new THREE.Matrix4().makeTranslation(newPos.x, parseFloat(obj.atli),newPos.z));	
			
	total.updateMatrix();

	thatGeoComments.geoCommentArray.push(total);



};