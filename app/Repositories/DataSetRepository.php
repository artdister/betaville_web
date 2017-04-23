<?php

namespace App\Repositories;

use DB;
use App\Datasets;
use App\DatasetsGeom;


use Phaza\LaravelPostgis\Geometries;
use App;
use Timezone;
class DataSetRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {

    	$this->ds = DB::table('datasets');
    	$this->dsGeom = DB::table('datasets_geom');

    }
    public function index(){


    }
    //add a new entry to the dataset table
    public function addJSONtoDB($objName, $cityID,  $cityName){
      
 
    	$dataset = new Datasets();
    	$dataset->name = $objName;
    	$dataset->city_id = $cityID;
        $dataset->dataSet = "geoData/".$cityName."/citys/dataset/".$objName.".json";
    	$dataset->save();

    	return $dataset->id;

    }

    //add json to DB old one via postgis c compiler
    public function addJSONtoDBJSONold($json, $varName, $ds_id){

        $jsonStr = '\''.json_encode($json->geometry).'\'' ;


        return print_r($json);



        $dataGeom = new DatasetsGeom();
        $dataGeom->ds_id = intval($ds_id);



        $dataGeom->geom = DB::raw('ST_GeomFromGeoJSON('.$jsonStr.')');
       // $dataGeom->setTagNames($keys);
       // $dataGeom->setTagValues($tagArray);





        if($json->geometry->type == "LineString" && !empty((array) $json->properties->tags)){
            $dataGeom->type = $json->properties->tags->$varName;
        }else
        if($json->geometry->type == "Polygon"){
            //sometihn else
        }
       
        $dataGeom->osm_id = $json->id;
        

       // $dataGeom->save();


    }



    //add json to DB via PHP 
    public function addJSONtoDBJSON($json, $varName, $ds_id, $geoData, $cityName, $objname){


        for($i = 0; $i < sizeof($json->features); $i++){

        /*    $tagArray = get_object_vars($json->features[$i]->properties->tags);
            $keys = array_keys($tagArray);

            for($j = 0; $j < sizeof($keys); $j++){

                $keys[$j] = str_replace(",", "&;", $keys[$j] );
                $keys[$j] = str_replace("[", "&!", $keys[$j] );
                $keys[$j] = str_replace("]", "!&", $keys[$j] );
                $keys[$j] = str_replace("\"", " ", $keys[$j] );

                $tagArray[$keys[$j]] = str_replace(",", " ", $tagArray[$keys[$j]] );
                $tagArray[$keys[$j]] = str_replace("[", "&!", $tagArray[$keys[$j]] );
                $tagArray[$keys[$j]] = str_replace("]", "", $tagArray[$keys[$j]] );
                $tagArray[$keys[$j]] = str_replace("]", "", $tagArray[$keys[$j]] );
                $tagArray[$keys[$j]] = str_replace("\"", " ", $tagArray[$keys[$j]] );
            }
        

           // $dataGeom->setTagNames($keys);
           // $dataGeom->setTagValues($tagArray);

        */

            // some hax here to prepare the string for postgis
           // $jsonStr = '\''.json_encode($json->features[$i]->geometry).'\'' ;

            //$dataGeom = new DatasetsGeom();

           // $dataGeom->ds_id = intval($ds_id);
           // $dataGeom->geom = DB::raw('ST_GeomFromGeoJSON('.$jsonStr.')');


            $gcoords = $json->features[$i]->geometry->coordinates;
            $gtype = $json->features[$i]->geometry->type;


           


            //if geojson features geometry is a line
            if($json->features[$i]->geometry->type == "LineString" ){
                $dataGeom = new DatasetsGeom();
                $dataGeom->ds_id = intval($ds_id);
                $outStr = "";
                
                for($p = 0; $p < sizeof($gcoords); $p++){
                    $pointSTR = 'ST_MakePoint(';   
                    
                    $pointSTR .= implode(", " , $gcoords[$p]); // convert array to string 
                    $pointSTR .= ")";
                    $p++;
                    if( $p != sizeof($gcoords)){
                        $pointSTR .= ", ";
                    }
                    $p--;


                    $outStr .= $pointSTR;
                }  

                $dataGeom->geom = DB::raw("ST_MakeLine(array[".$outStr."])");
                

                if(!empty((array) $json->features[$i]->properties->tags)) {
                    $dataGeom->type = $json->features[$i]->properties->tags->$varName;
                }

                $dataGeom->osm_id = $json->features[$i]->id;
                $dataGeom->save();

            }else
             //if geojson features geometry is a polygon
            if($json->features[$i]->geometry->type == "Polygon") {
                


                
                for($p = 0; $p < sizeof($gcoords); $p++){
                    $dataGeom = new DatasetsGeom();
                    $dataGeom->ds_id = intval($ds_id);
                    $outStr = "LINESTRING(";


                    for($pp = 0 ; $pp < sizeof($gcoords[$p]) ;$pp++){
                        
                            $outStr .= implode(" ", $gcoords[$p][$pp]);
                            
                            $pp++;
                            if( $pp != sizeof($gcoords[$p])){
                                $outStr .= ", ";
                            }
                            $pp--;

                    }
                    $outStr .= ")";
                    $dataGeom->geom = DB::raw("ST_MakePolygon(ST_GeomFromText('".$outStr."'))");
                    
                     if(!empty($json->features[$i]->properties->tags->height)){

                    $dataGeom->height = (string)$json->features[$i]->properties->tags->height;

                }
                
                    $dataGeom->osm_id = $json->features[$i]->id;
                    $dataGeom->save();


                }

               

                
            }
           
             
        }
        
        //if json created successfully, create the json file
        if (json_decode($geoData) != null){
            if (!file_exists('../storage/app/geoData/'.$cityName.'/citys/dataset/')) {
                mkdir('../storage/app/geoData/'.$cityName.'/citys/dataset', 0777, true);
            }

            $file = fopen('../storage/app/geoData/'.$cityName.'/citys/dataset/'.$objname.'.json','w+');
            fwrite($file, $geoData);
            fclose($file);
        }



        return intval($ds_id);
       // return $geoData;
    }



    //get all datasets from DB
    public function getDatasetByCityID($id){

        $out = Datasets::where('city_id' , $id)->get();
        return $out;
    }

    //get geometries from DB
    public function getMapDataGeomByID($id){


      //  $db = DatasetsGeom::where('ds_id', $id)
      //              ->get();

        $pos = DB::table('datasets_geom')
                    ->where('ds_id', $id)
                    ->select(DB::raw("ST_AsGeoJSON(geom) AS geom"))
                    ->addSelect(DB::raw("type"))
                    ->addSelect(DB::raw("height"))
                    ->get();

     


    //    $geojson = array( 'type' => 'FeatureCollection', 'features' => array());
/*
        for($i = 0; $i < sizeof($db); $i++){


            $db[$i]->keys = $db[$i]->getTagNames();
            $db[$i]->values = $db[$i]->getTagValues();              
            
            
            $propArray = array();
            for($j = 0; $j < sizeof($db[$i]->keys) ;$j++){

                $propArray[$db[$i]->keys[$j]] = $db[$i]->values[$j] ;

            }


    

            $feature = array(   'id' => $db[$i]->osm_id,
                                'type' => 'Feature',
                                'properties' => $propArray,
                                'geometry' =>  json_decode($pos[$i]->geom) );

            array_push( $geojson['features'], $feature);
        }
       */
        return $pos;

    }

    //remove dataset from DB
    public function removeMapDataByID($id){

       $this->ds->where('id', $id)->delete();  
       return $id;

    }
}