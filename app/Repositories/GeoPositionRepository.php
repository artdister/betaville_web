<?php

namespace App\Repositories;

use DB;
use App\Geo_Positions;

use Phaza\LaravelPostgis\Geometries\Point;

use App;
use Timezone;

class GeoPositionRepository
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
    public function getGeoPositionByParent($i){

    	$out = Geo_Positions::where('city_id', $i)->where('onscene' , true)->get();


    	$pos = DB::table('geo__positions')
                        ->select(DB::raw('ST_AsText(position) AS position'))
                        ->where('city_id' , $i)->where('onscene' , true)
                        ->get();
        for($i = 0; $i < sizeof($out); $i++){
            $out[$i]->position = $pos[$i]->position;
            
          //  $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
          //  $out[$i]->created_at = $time;
        }

        return $out;
    }

	public function addGeoPosition($data){
		$geopos = new Geo_Positions();

		$geopos->city_id	= $data['parentId'];
		$geopos->name 		= $data['name'];
		$geopos->author 	= $data['author'];
		$geopos->atli 		= $data['atli'];
		$geopos->position 	= new Point($data['lat'], $data['lng']);

		$geopos->save();
		return $geopos;
	}

    public function moveGeoPositionToTrashByid($i){

      

        $file = Geo_Positions::where('id' , $i)->first();

        $file->onscene = false;
        $file->save();


        return $file;

    }
}

 