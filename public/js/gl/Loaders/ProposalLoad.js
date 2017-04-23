/*
*	manage the proposals druing load
*/
function ProposalsLoad(){
		propLoader = this;
		this.propArray = new Array();

		this.highlightProposal = "";
		this.defColor = "rgb(255,153,0)";
		this.hoverMaterialColor = "rgb(255, 204, 0)";
		this.pickedMaterialColor = "rgb(255,255,255)";

}
//load the proposals and and push them to one array
ProposalsLoad.prototype.load = function(obj, cb){


				//create model
				var geometry = new THREE.CylinderGeometry( 100, 0.1, 150, 4 );
				var material = new THREE.MeshBasicMaterial( {color: this.defColor} );
				var cylinder = new THREE.Mesh( geometry, material );

				//convert wkt to js object
				var wkt = new Wkt.Wkt();
				var latlng = wkt.read(obj.position);

				//convert lat/long to 3D scene coords.
				var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
				var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");


				//bring th eproposal in position
				cylinder.position.x = newPos.x;
				cylinder.position.y = parseFloat(obj.atli);
				cylinder.position.z = newPos.z;

				//add userData
				cylinder.name = obj.name;
				cylinder.userData.id = obj.id;
				cylinder.userData.defMat = material;
				cylinder.updateMatrix();
				propLoader.propArray.push(cylinder.clone());


				cb(cylinder);
			//loadJSON(addProposalCount, "./JSON/BremenProposalsOBJ.json");

}

//change proposal color on user interact
ProposalsLoad.prototype.renderHightlightProposal = function(obj){

	if( thatRay.pickedProposal == ""){

		if(obj == ""){
			if(this.highlightProposal != ""){
				this.highlightProposal.material.color.set(propLoader.defColor);

			}

			this.highlightProposal = "";
			return;
		}else{

			if(this.highlightProposal == ""){

				this.highlightProposal = obj;
				this.highlightProposal.material.color.set(propLoader.hoverMaterialColor);

			}
		}

	}


}




ProposalsLoad.prototype.addCount = function(json){
	var pobjJson = json;
	var count = 0;



}
