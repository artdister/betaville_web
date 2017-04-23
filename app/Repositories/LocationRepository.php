<?php

namespace App\Repositories;

use DB;
use App\Locations;

use Phaza\LaravelPostgis\Geometries\Point;

use App;
use Timezone;

class LocationRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {

    }
    public function index(){
    	   


    }
    //get localion area geometry
    public function getPosByID($id){


        $out = Locations::where('gid', $id)->first();
        $pos = Locations::select(DB::raw('ST_AsGeoJSON(geom) AS geom'))
                        ->where('gid' , $id)
                        ->first();


      //  $out->geom = $pos;


        return $pos->geom;

    }

    //get all location area geometries via city ID
    public function getLocationsByCityID($id){
        
        $out = Locations::where('city_id', $id)->get();
        $pos = Locations::select(DB::raw('ST_AsGeoJSON(geom) AS geom'))
                        ->where('city_id' , $id)
                        ->get();

        for($i = 0; $i < sizeof($out); $i++){
            $out[$i]->geom = $pos[$i]->geom;

        }

        

        return $out;


    }


}

 