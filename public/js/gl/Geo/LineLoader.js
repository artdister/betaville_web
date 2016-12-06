function LineLoader(){

		this.ObjArray = new Array();
		this.geometry = new THREE.Geometry();
        this.scaleMatrix = new THREE.Matrix4();
        this.loaded = false;
}

LineLoader.prototype.load = function(shpsrc){
 
    SHPParser.load(shpsrc + '.shp', thatground.city.shpLoad, "");
    DBFParser.load(shpsrc + '.dbf', thatground.city.dbfLoad, "");

}

LineLoader.prototype.shpLoad = function(shp){
    thatground.city.SHP = shp;
    if(typeof (thatground.city.SHP && thatground.city.DBF) == "object"){
        thatground.city.createTerrainArrayGeometry(thatground.city.SHP, thatground.city.DBF);
    }
}

LineLoader.prototype.dbfLoad = function(dbf){
    thatground.city.DBF = dbf;
    if(typeof (thatground.city.SHP && thatground.city.DBF) == "object"){
        thatground.city.createTerrainArrayGeometry(thatground.city.SHP, thatground.city.DBF);
    }
}

LineLoader.prototype.createTerrainArrayGeometry = function(shp,dbf){

        var dbflist = dbf.records;

        var indicesMask, sp, np,upV,ab, ac, normalV, runVertices, runIndices;

        //scale the shape File and move it to center
        var linewidth = 10;

  

       // console.log(dbflist[0],shp.records[0]);
        for(var i = 0; i < shp.records.length;i++){
           // if(dbflist[i].name != "" && dbflist[i].type != ("platform")  && dbflist[i].type != ("pedestrian") && dbflist[i].type != ("path") && dbflist[i].type != ("footway")){
            if(dbflist[i].name != "" && ( dbflist[i].type == "river" || dbflist[i].type == "drain")){
                    

                var geometry = new THREE.Geometry();
                var points = shp.records[i].shape.content.points;

                var vertices = new Float32Array(points.length/2);

          
                
                 sp = new THREE.Vector3();
                 np = new THREE.Vector3();
                 upV = new THREE.Vector3(0,1,0);

                 ab = new THREE.Vector3();
                 ac = new THREE.Vector3();
                 normalV = new THREE.Vector3();

                 runVertices = 0;

                for(var j = 0; j < vertices.length; j = j+1){
                    
                    
                    var sp = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices], 0, points[runVertices+1]),"x/z" );

                    geometry.vertices.push(
                        sp
                    );


                   // console.log(points[runVertices+2] , points[runVertices+3]);
                    if(points[runVertices+2] && points[runVertices+3]){
                        var np = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices+2], 0, points[runVertices+3]),"x/z");

                        upV.x = sp.x;
                        upV.z = sp.z;
                        
                        ab.subVectors(np,sp).normalize();
                        ac.subVectors(upV,sp).normalize();

                        normalV.crossVectors(ab,ac);
                        normalV.add(sp);
                        normalV.addScalar(linewidth);

                        geometry.vertices.push(
                            normalV
                        );
  


                    }else{

                        var np = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices-2], 0, points[runVertices-1]),"x/z");
                   

                        upV.x = sp.x;
                        upV.z = sp.z;
                        
                        ab.subVectors(np,sp).normalize();
                        ac.subVectors(upV,sp).normalize();

                        normalV.crossVectors(ac,ab);
                        normalV.add(sp);
                        normalV.addScalar(linewidth);

                        geometry.vertices.push(
                            normalV
                        );

                     
                   
                    }

                   runVertices = runVertices+2;
                   

                }
                geometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
               // geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
                geometry.computeBoundingSphere();   
                
                

                
                var material = new THREE.MeshBasicMaterial({ side:THREE.DoubleSide, color:0x0000FF} );

                var meshLine = new THREE.Mesh( geometry, material.clone());              
              //  meshLine.name = "GroundLine:"+dbflist[i].osm_id;
                meshLine.position.y = 15;
                meshLine.receiveShadow = true;
                meshLine.rotation.x = Math.PI;
                meshLine.rotation.y = Math.PI;
                
                thatground.city.ObjArray.push(meshLine.clone());
              

       
                //thisCore.scene.add(meshLine);
                //thisCore.scene.add(lines);
                
            }

        }

        console.log( thatground.city.ObjArray[0]);
}


LineLoader.prototype.createTerrainArrayBufferGeometry = function(shp,dbf){

        var dbflist = dbf.records;

        var indicesMask, sp, np,upV,ab, ac, normalV, runVertices, runIndices;

        //scale the shape File and move it to center
        var linewidth = 10;

  

       // console.log(dbflist[0],shp.records[0]);
        for(var i = 0; i < shp.records.length;i++){
           // if(dbflist[i].name != "" && dbflist[i].type != ("platform")  && dbflist[i].type != ("pedestrian") && dbflist[i].type != ("path") && dbflist[i].type != ("footway")){
            if(dbflist[i].name != "" && ( dbflist[i].type == "river" || dbflist[i].type == "drain")){
                    

                var linegeom = new THREE.BufferGeometry();
                var geometry = new THREE.BufferGeometry();
                var points = shp.records[i].shape.content.points;

                var vertices = new Float32Array((points.length+(points.length/2)) * 2);
                var lineVertic = new Float32Array((points.length+(points.length/2)) );
            
          

                var indices = new Uint32Array(((points.length/2) -1) *6 );
                indicesMask = new Array(0,2,1,1,2,3);
                
                 sp = new THREE.Vector3();
                 np = new THREE.Vector3();
                 upV = new THREE.Vector3(0,1,0);

                 ab = new THREE.Vector3();
                 ac = new THREE.Vector3();
                 normalV = new THREE.Vector3();

                 runVertices = 0;
                 runIndices = 0;


                for(var j = 0; j < vertices.length; j = j+6){
                    
                    
                    var sp = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices], 0, points[runVertices+1]),"x/z" );

                    vertices[j + 0] = sp.x *(1);
                    vertices[j + 1] = sp.y;
                    vertices[j + 2] = sp.z;

              
                    indices[j + 0] = indicesMask[0] + runIndices;
                    indices[j + 1] = indicesMask[1] + runIndices;
                    indices[j + 2] = indicesMask[2] + runIndices;
                   // console.log(points[runVertices+2] , points[runVertices+3]);
                    if(points[runVertices+2] && points[runVertices+3]){
                        var np = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices+2], 0, points[runVertices+3]),"x/z");

                        upV.x = sp.x;
                        upV.z = sp.z;
                        
                        ab.subVectors(np,sp).normalize();
                        ac.subVectors(upV,sp).normalize();

                        normalV.crossVectors(ab,ac);
                        normalV.add(sp);
                        normalV.addScalar(linewidth);

                        vertices[j + 3] = normalV.x *(1);
                        vertices[j + 4] = 0;
                        vertices[j + 5] = normalV.z;
          


                    }else{

                        var np = thisCore.scaleCoordToTerrain(new THREE.Vector3(points[runVertices-2], 0, points[runVertices-1]),"x/z");
                   

                        upV.x = sp.x;
                        upV.z = sp.z;
                        
                        ab.subVectors(np,sp).normalize();
                        ac.subVectors(upV,sp).normalize();

                        normalV.crossVectors(ac,ab);
                        normalV.add(sp);
                        normalV.addScalar(linewidth);

                        vertices[j + 3] = normalV.x *(1);
                        vertices[j + 4] = 0;
                        vertices[j + 5] = normalV.z;
                   

                   
                    }



                    indices[j + 3] = indicesMask[3] + runIndices *(1);
                    indices[j + 4] = indicesMask[4] + runIndices;
                    indices[j + 5] = indicesMask[5] + runIndices;
                

                    runVertices = runVertices+2;
                    runIndices = runIndices+2;



                }
                
                var linevertic = 0;
                for(var r = 0; r < lineVertic.length;r +=3){

                    lineVertic[r + 0] = (parseFloat(points[linevertic]) *(1)); 
                    lineVertic[r + 1] = -10;
                    lineVertic[r + 2] = (parseFloat(points[linevertic+1]) ); 
                    linevertic +=2;
                }
                  


                linegeom.addAttribute( 'position', new THREE.BufferAttribute( lineVertic, 3 ) );
                linegeom.applyMatrix(thatground.scaleLinesMatrix);

             
                geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
                geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
               // geometry.computeBoundingSphere();
                

                
 

                var lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 } );
                var lines = new THREE.Line(linegeom, lineMaterial);
                lines.receiveShadow = true;
                lines.rotation.x = Math.PI;
                lines.rotation.y = Math.PI;

                
        var material = new THREE.MeshBasicMaterial({ side:THREE.DoubleSide, color:0x0000FF} );

        var meshLine = new THREE.Mesh( this.geometry, material.clone());              
      //  meshLine.name = "GroundLine:"+dbflist[i].osm_id;
        meshLine.position.y = 15;
        meshLine.receiveShadow = true;
        meshLine.rotation.x = Math.PI;
        meshLine.rotation.y = Math.PI;
       
        thatground.city.ObjArray.push(meshLine.clone());
                
                //thisCore.scene.add(meshLine);
                //thisCore.scene.add(lines);
                
            }

        }


}
