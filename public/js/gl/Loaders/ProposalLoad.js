function ProposalsLoad(){
		propLoader = this;
		this.propArray = new Array();

		this.highlightProposal = "";
		this.defColor = "rgb(255,153,0)";
		this.hoverMaterialColor = "rgb(255, 204, 0)";
		this.pickedMaterialColor = "rgb(255,255,255)";

}

ProposalsLoad.prototype.load = function(obj, cb){



				var geometry = new THREE.CylinderGeometry( 100, 0.1, 150, 4 );
				var material = new THREE.MeshBasicMaterial( {color: this.defColor} );
				var cylinder = new THREE.Mesh( geometry, material );

				var wkt = new Wkt.Wkt();
				var latlng = wkt.read(obj.position);

				var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
				var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");


				//console.log("proposal", newPos, pos.coord);
				cylinder.position.x = newPos.x;
				cylinder.position.y = parseFloat(obj.atli);
				cylinder.position.z = newPos.z;

				cylinder.name = obj.name;
				cylinder.userData.id = obj.id;
				cylinder.userData.defMat = material;
				cylinder.updateMatrix();
				propLoader.propArray.push(cylinder.clone());


				cb(cylinder);
			//loadJSON(addProposalCount, "./JSON/BremenProposalsOBJ.json");

}


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
