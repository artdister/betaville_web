<?php

namespace App\Repositories;

use DB;
use App\Buildings;



use Phaza\LaravelPostgis\Geometries\Point;
use App;
use Timezone;


class BuildingsRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {

    	$this->db = DB::table('buildings');

    }
    public function index(){


    }

    //get all building from table
    public function getAll()
    {
        return Buildings::where('onscene' , true)->get();
    }


    //get building objects from tabel via ciyt ID 
    public function getObjectsByParentIndex($cityid){

        $out = Buildings::where('city_id' , $cityid)->where('onscene' , true)->get();
        $pos = DB::table('buildings')
                        ->select(DB::raw('ST_AsText(position) AS position'))
                        ->where('city_id' , $cityid)->where('onscene' , true)
                        ->get();


        for($i = 0; $i < sizeof($out); $i++){
            $out[$i]->position = $pos[$i];

            //convert the rotation and quaternion 
            $out[$i]->rotation = $out[$i]->getRotation();
            $out[$i]->quaternion = $out[$i]->getQuaternion();

            $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
            $out[$i]->created_at = $time;
            


        }





        return $out->all();

    }

    //get buildings from DB via city ID and post codes
    public function getObjectsByParentIndexWithPostCodes($cityid, $post_codes){


        $out = array();
        $out['high'] = array();
        $out['low'] = array();
        //if post code is available
        if($post_codes != false){

                for($i = 0; $i < sizeof($post_codes);$i++){

                        //get post code area center
                        $location = DB::table('datamap')
                                ->select(DB::raw('ST_AsText(ST_Centroid(geom)) AS center'))
                                ->addSelect(DB::raw('ST_AsText(geom) AS geom'))
                                ->where('cfsauid' , $post_codes[$i])
                                ->first();


                        /* Experimental
                        $posD = DB::table('buildings')
                                ->selectRaw("ST_Distance_Sphere(ST_AsText(position), '$location->center') <= 1 * 1609.34 AS position"  )
                                ->where('city_id' , $cityid)->where('onscene' , true)
                                ->get();

                        ST_Contains( '.$pCode[$j]->geom.', ST_GeomFromText('.$build[$i]->position.') )
                        */

                        //get collada buildings inside the pot codes area
                        $buildHigh = Buildings::where('city_id' , $cityid)->where('onscene' , true)
                                ->select(DB::raw('id, name, url, scale, atli, created_at, onscene, updated_at'))
                                ->addSelect(DB::raw('ST_AsText(position) AS position'))
                                ->addSelect(DB::raw('rotation'))
                                ->addSelect(DB::raw('quaternion'))
                                ->where(DB::raw("st_contains(   ST_GeomFromText('$location->geom') ,
                                                            ST_GeomFromText(ST_AsText(position)
                                                        ) )"), true )

                                //->where('ST_Contains( '.$location->geom.','.$build[$i]->position.' )',  )
                                //->where('ST_Distance_Sphere(ST_AsText(position), '.$location->center.' )', '<=', 1 * 1609.34  )
                                ->get();

                        //get vector buildings inside the post code area
                        $buildLow = DB::table('databuildings')->where('city_id' , $cityid)
                                ->select(DB::raw('gid, z, elez, status'))
                                ->addSelect(DB::raw('ST_AsGeoJSON(geom) AS geom'))
                                ->where(DB::raw("st_contains(   ST_GeomFromText('$location->geom') ,
                                                            ST_GeomFromText(ST_AsText(geom)
                                                        ) )"), true )->get();


                        //if there objects inside geom add to out array
                        if(sizeof($buildHigh) > 0){

                                $out['high'] = array_merge($out['high'], $buildHigh->all() );

                        }

                        if(sizeof($buildLow) > 0){

                                $out['low'] = array_merge($out['low'], $buildLow );
                                
                        }

                }
        //if post code areas are not available
        }else{


                //get all bulildings via the city ID
                $out['high'] = Buildings::where('city_id' , $cityid )->where('onscene' , true)->get();

                $pos = DB::table('buildings')
                                ->select(DB::raw('ST_AsText(position) AS position'))
                                ->where('city_id' , $cityid )->where('onscene' , true)
                                ->get();




        }

        //set options for the out array
        for($i = 0; $i < sizeof($out['high']); $i++){
                if(isset($pos)){
                        $out['high'][$i]->position = $pos[$i]->position;
                }

                $out['high'][$i]->rotation = $out['high'][$i]->getRotation();
                $out['high'][$i]->quaternion = $out['high'][$i]->getQuaternion();
                $out['high'][$i]->hiddenBuildData = $out['high'][$i]->gethiddenObj();
               // $time = Timezone::convertFromUTC($out['high'][$i]['created_at'], App::make('location')['timezone'] );
                //$out['high'][$i]->created_at = $time;

        }


        return $out;




    }



    //move buildings to trash 
    public function moveBuildingToTrashByid($i){
        $trash = DB::table('buildings_trash');

        $file = Buildings::where('id' , $i)->first();


        //create new buildings trash entry
        $trash->insert(
            [
                'id'          => $file->id,
                'city_id'     => $file->city_id,
                'name'        => $file->name,
                'author'      => $file->author,
                'url'         => $file->url,
                'scale'       => $file->scale,
                'atli'        => $file->atli,
                'position'    => $file->position,
                'created_at'  => $file->created_at,
                'updated_at'  => $file->updated_at,
                'rotation'    => $file->rotation,
                'quaternion'  => $file->quaternion



            ]
        );
        $file->onscene = false;
        $file->save();


        return $file;
        //$this->db->where('id', $i)->delete()
    }

    //add a city object
    public function addCityobj($data, $src){

        //create ne entry
        $building = new Buildings();
        $building->city_id = $data['parentID'];
        $building->name = 'Build:'.$data['name'];
        $building->author = $data['author'];
        $building->url = $src;
        $building->scale =  $data['scale'];
        $building->atli = $data['atli'];

        $building->position = new Point($data['lat'], $data['lng']);

        $building->setRotation(array($data['rotatX'], $data['rotatY'], $data['rotatZ'] ) );
        $building->setQuaternion(array($data['quaternionW'],
                                        $data['quaternionX'],
                                            $data['quaternionY'],
                                                $data['quaternionZ'] ) );


        $building->save();


        //edit the position to use postgis
        $pos = DB::table('buildings')
                        ->select(DB::raw('ST_AsText(position) AS position'))
                        ->where('city_id' , $data['parentID'])->where('onscene' , true)
                        ->orderBy('created_at', 'desc')->first();

        $building->position = $pos->position;

        $building->rotation = array($data['rotatX'], $data['rotatY'], $data['rotatZ'] );
        $building->quaternion = array($data['quaternionW'],
                                        $data['quaternionX'],
                                            $data['quaternionY'],
                                                $data['quaternionZ'] ) ;

        return $building;


    }

    //get all buildings from trash via city ID
    public function getBuildingFromTrash($i){

       return DB::table('buildings_trash')->where('city_id',$i)->get();
    }

    //edit the buildings position
    public function buildingReplace($r)
    {
        $pos = explode(",",$r['position']);
        $rot = explode(",",$r['rotation']);
        $qua = explode(",",$r['quaternion']);
        $scl = explode(",",$r['scale']);
        
        $building = Buildings::where('id' , $r['id'])->first();

        $building->position = new Point(round($pos[2],6), round($pos[0],6) );
        $building->atli = round($pos[1],3);

        $building->setRotation(array(round($rot[0],3),
                                        round($rot[1],3),
                                            round($rot[2],3) ) );

        $building->setQuaternion(array(round($qua[0],6),
                                        round($qua[1],6),
                                            round($qua[2],6),
                                                round($qua[3],6) ) );



        $building->scale =  $scl[0];
        $building->save();

        return var_dump($building);
    }
}
