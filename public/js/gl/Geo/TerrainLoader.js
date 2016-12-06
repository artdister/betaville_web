function Terrain(){

        this.corner = {};
        
        this.terrainLoader = new THREE.WcsTerrainLoader();
        this.plane;



}

Terrain.prototype.load = function(data, loaded){
        thatground.terrain.parthToTerrainData = data;
        this.terrainLoader.parse(data, function(data) {


            data.clean("empty");

            var vertices = new Float32Array(data.length * 3);
            var colors = new Float32Array( data.length * 3 );

            var color = new THREE.Color();
            color.setRGB( 0, 100, 0 );
            var xyLenght = new Array();
            xyLenght.push(0);
            var geometry = new THREE.BufferGeometry();
           // geometry.applyMatrix( new THREE.Matrix4().makeRotationX(  Math.PI / 2 ) );


            var i,j = 0;

            for(i = 0, j = 0 ; j < data.length; i += 3, j += 1){

                    if(data[j+1]){
                        if(data[j][2] != data[j+1][2]){
                            xyLenght.push(j+1);
                        }

                    }

                    if( thatground.theights.min > parseFloat(data[j][1])){
                        // thatground.depestPoint = parseFloat(data[j][1]);
                         thatground.theights.min = parseFloat(data[j][1]);
                    }

                    if( thatground.theights.max < parseFloat(data[j][1])){
                        // thatground.depestPoint = parseFloat(data[j][1]);
                         thatground.theights.max = parseFloat(data[j][1]);
                    }

                    if(parseFloat(thatground.waterlevel.max) >= parseFloat(data[j][1])
                        && parseFloat(thatground.waterlevel.min) <= parseFloat(data[j][1])
                        && thatground.waterlevel.max != "none"){

                        thatground.subwaterlevelGeoArray.push(new THREE.Vector3(parseFloat(data[j][0],6), parseFloat(data[j][1],6), parseFloat(data[j][2],6) ));
                    }

                    //var pos = new THREE.Vector3(data[j][0], data[j][1] , data[j][2]);
                   // var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");

                    var newPos = merc.px( [ data[j][0], data[j][2] ] , thatground.worldScale);
         
                    vertices[i + 0] = newPos[0];
                    vertices[i + 1] = data[j][1] * 10;
                    vertices[i + 2] = newPos[1];

                    var hightDif = parseFloat(thatground.hightsPoint) ;
                    var seelevelDif = thatground.waterlevel.max - thatground.waterlevel.min;
                    var d = data[j][1];
                    if(d < 0){
                        d = d*(-1);
                    }

                    if(parseFloat(thatground.waterlevel.max) >= parseFloat(data[j][1])
                        && thatground.waterlevel.max != "none" && thatground.waterlevel.max != undefined){

                        if(loadingData['loadData']['data']['waterlevel'] == 'true'){
                            var red = 1.53;
                            var greenblue = 2.04;
                        }else{
                            var red = 3;
                            var greenblue = 3;
                        }



                        colors[i + 0] = red;
                        colors[i + 1] = greenblue;
                        colors[i + 2] = greenblue;


                    }else
                    if( thatground.hightsPoint != "none" ){

                           //For TOPO set to fixed value to remove that
                        colors[i + 0] = 3 + data[j][1]/100;
                        colors[i + 1] = 3 + data[j][1]/100;
                        colors[i + 2] = 3 + data[j][1]/100;


                    }else{
    

                        if(loadingData['loadData']['data']['topo'] == 'true'){
                            var green = data[j][1]/1000;
                        }else{
                            var green = 0.2;
                        }
                            colors[i + 0] = 0.2;
                            colors[i + 1] = data[j][1]/100; // def green var
                            colors[i + 2] = 0.2;


                    }
               


            }


            thatground.terrain.bbox = [ parseFloat(data[data.length-1][2]), parseFloat(data[0][0]) ,
                                         parseFloat(data[0][2]), parseFloat(data[data.length-1][0]) ];


         //   thatground.terrain.bbox = [ 13.0084, -59.7065, 13.3613, -59.3973 ];


            xyLenght.push(j);

            var tempIndecis = new Array();


            var corner = 0;
            var j = 0;
            for(var i = 0; i < xyLenght.length - 2  ; i++){

                var indecisMask = new Array(xyLenght[i], xyLenght[i+1], xyLenght[i] + 1,
                                        xyLenght[i+1], xyLenght[i+1]+1, xyLenght[i]+ 1);


                for( j = 0; j < xyLenght[1]-1; j +=1){
                    if(xyLenght[i+1]-1 >= xyLenght[i]+j){

                            tempIndecis[corner + 0] = indecisMask[1] + j;
                            tempIndecis[corner + 1] = indecisMask[0] + j;
                            tempIndecis[corner + 2] = indecisMask[2] + j;

                            tempIndecis[corner + 3] = indecisMask[4] + j;
                            tempIndecis[corner + 4] = indecisMask[3] + j;
                            tempIndecis[corner + 5] = indecisMask[5] + j;
                            corner += 6;


                    }

                }



            }


            var indecis = new Uint32Array( tempIndecis.length  );
            for(var r = 0; r < tempIndecis.length;r++){
                indecis[r] = parseFloat(tempIndecis[r]);

            }

           // geometry.addAttribute( 'index', new THREE.BufferAttribute( indecis, 1 ) );
            geometry.setIndex( new THREE.BufferAttribute( indecis, 1 ) );
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

      /*    
            thatground.setMatrixForscale(1000000, geometry.attributes.position.array[geometry.attributes.position.array.length-3],
                                                geometry.attributes.position.array[geometry.attributes.position.array.length-1]*(-1) );

            thisCore.setTransformMatrix(1000000, geometry.attributes.position.array[geometry.attributes.position.array.length-3],
                                                geometry.attributes.position.array[geometry.attributes.position.array.length-1]);




            geometry.applyMatrix(thatground.scaleMatrix);
            geometry.applyMatrix(thatground.transformtoOriginMatrix);

    */


            var min = {
                x:geometry.attributes.position.array[geometry.attributes.position.array.length-3],
                z:geometry.attributes.position.array[geometry.attributes.position.array.length-1]  
            };
            var max = {
                x:geometry.attributes.position.array[0],
                z:geometry.attributes.position.array[2]
            };

            var center = new THREE.Vector3();
            var centerMatrix = new THREE.Matrix4();

            var offX = ((max.x - min.x)/2); 
            var offZ = ((max.z - min.z)/2); 
            center.set(
                    min.x + offX,
                    0,
                    min.z + offZ   
                );

         
            centerMatrix.set(   1, 0, 0, -min.x,
                                0, 1, 0, 0,
                                0, 0, 1, -min.z,
                                0, 0, 0, 1);



            //geometry.applyMatrix( centerMatrix );
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-center.x, 0 , -center.z));

            thatground.setTransformToorigin(center);




            thatground.terrain.setCornerFromGeometry(   geometry.attributes.position,
                                                        (xyLenght[1]-1)*3,
                                                        (xyLenght[xyLenght.length-2])*3
                );


            thatground.terrain.light = new THREE.HemisphereLight( 0xA6A6FF, 0x00000, 1.5);
            thatground.terrain.light.color.setHSL( 0.0, 0.0, 0.75 );


            thatground.terrain.light.position.set(  thatground.terrain.corner.maxX.x/2,
                                                    thatground.hightsPoint,
                                                    -10
                                    );


            thatground.terrain.light.updateMatrixWorld();


            geometry.computeBoundingBox();
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            var wpos = new THREE.Vector3(data[0][0], data[0][1], data[0][2]).normalize();
            if(wpos.x <= 0){
                thatground.worldSection.x = 1;
            }else{
                thatground.worldSection.x = -1;
            }
            if(wpos.z <= 0){
                thatground.worldSection.z = 1;
            }else{
                thatground.worldSection.z = -1;
            }

            thatground.theights.center = thatground.theights.max-(thatground.theights.min*(-1));
 

    /*
        var material = new THREE.MeshLambertMaterial(
            {
                side:THREE.DoubleSide,
                fog: false,
                vertexColors: THREE.VertexColors,

                polygonOffset: true,
                polygonOffsetUnits: 1,
                polygonOffsetFactor: 1, // more in front

            } );
        material.needsUpdate = true;
    */
     // color:0x003300,
            var shader = THREE.ShaderLib['lambert'];

            shader.uniforms.diffuse.value = new THREE.Color("rgb(60,60,60)");
            shader.uniforms.emissive.value = new THREE.Color( "rgb(20, 20, 20)" );

            if(loadingData['loadData']['data']['terrain'] == 'true'){
                 shader.uniforms.opacity.value = 1;
            }else{
                 shader.uniforms.opacity.value = 0;
            }



            shader.uniforms.directionalLightDirection.value = [thatground.terrain.corner["maxXZ"].x/2,
                                                                100,
                                                             -10,
                                                             thatground.terrain.corner["maxXZ"].x/2,
                                                             100,
                                                             thatground.terrain.corner["maxXZ"].z/2];


            var material = new THREE.ShaderMaterial( {
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                vertexColors: THREE.VertexColors,
                lights:true,
                shading : THREE.SmoothShading,
                side:THREE.DoubleSide

            } );




            thatground.terrain.plane = new THREE.Mesh(geometry, material);
            thatground.terrain.plane.name = "GeoGround";
            thatground.terrain.plane.frustumCulled = false;
            thatground.terrain.plane.position.set(0,0,0);
            thatground.terrain.plane.scale.x = thatground.terrain.plane.scale.y = thatground.terrain.plane.scale.z = 1;
            thatground.terrain.plane.castShadow = false;
            thatground.terrain.plane.receiveShadow = true;

            //thatground.terrain.plane.geometry.verticesNeedUpdate = true;


        /*
            console.log(thatground.terrain.corner["minXZ"]);
            console.log(thatground.terrain.corner["maxZ"]);
            console.log(thatground.terrain.corner["maxX"]);

            console.log(thatground.hightsPoint, thatground.waterlevel);
          */

            
            if(typeof(loaded) == 'function'){
                loaded();
            }
 
    });



}

Terrain.prototype.setCornerFromGeometry = function(g,maxXZ,maxZ){


    thatground.terrain.corner["maxXZ"] = new Object();
    thatground.terrain.corner["maxXZ"]["x"] = g.array[0];
    thatground.terrain.corner["maxXZ"]["y"] = g.array[1];
    thatground.terrain.corner["maxXZ"]["z"] = g.array[2];

    thatground.terrain.corner["minXZ"] = new Object();
    thatground.terrain.corner["minXZ"]["x"] = g.array[g.array.length-3];
    thatground.terrain.corner["minXZ"]["y"] = g.array[g.array.length-2];
    thatground.terrain.corner["minXZ"]["z"] = g.array[g.array.length-1];

    thatground.terrain.corner["maxZ"] = new Object();
    thatground.terrain.corner["maxZ"]["x"] = g.array[maxXZ];
    thatground.terrain.corner["maxZ"]["y"] = g.array[maxXZ+1]
    thatground.terrain.corner["maxZ"]["z"] = g.array[maxXZ+2];

    thatground.terrain.corner["maxX"] = new Object();
    thatground.terrain.corner["maxX"]["x"] = g.array[maxZ];
    thatground.terrain.corner["maxX"]["y"] = g.array[maxZ+1]
    thatground.terrain.corner["maxX"]["z"] = g.array[maxZ+2];



}
