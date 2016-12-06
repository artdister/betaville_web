<?php

namespace App\Repositories;

use DB;
use App\Buildings;
use App\Cities;

class CitiesRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {
       
        $this->db = DB::table('cities');
        $this->odb = DB::table('buildings');   
        $this->locations = DB::table('datamap');
    }

    
    public function getAll()
    {
        $out = Cities::select('id', 'name')->get();
        return $out;
    /*
        return $this->db
                    ->get();
    */
    }
    
    public function getDataByindex($i){
        $out = array();
        $out['city'] = Cities::where('id' , $i)->first();
        $out['location'] = $this->locations->where('city_id', $i)->get();
        $pos = DB::table('datamap')
                        ->select(DB::raw('ST_AsGeoJSON(geom) AS geom'))
                        ->where('city_id' , $i)
                        ->get();

                                                                                                   


        for($i = 0; $i < sizeof($out['location']); $i++){
            $out['location'][$i]->geom = $pos[$i]->geom;
        }
    


        return $out;
    /*
        return $this->db->where('id' , $i)
                    ->first();  

    */      
    }
    
    public function getCitybyindex($i){
        
        $out = Cities::where('id' , $i)->get();
        return $out;
        /*
        return $this->db->where('id' , $i)
                    ->get();  
        */
    }
}