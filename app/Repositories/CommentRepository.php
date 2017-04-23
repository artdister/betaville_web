<?php

namespace App\Repositories;

use DB;
use App\Building_comments;
use App\Geo_Position_comments;
use App\Proposal_object_comments;

use Phaza\LaravelPostgis\Geometries\Point;

use App;
use Timezone;

class CommentRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {
       
    	$this->db = DB::table('building_comments');
        $this->pocdb = db::table('proposal_object_comments');
   
    }
    public function index(){
    	

    }

    //get building comment from DB
    public function getByBuildId($i){

        $out = Building_comments::where('building_id' , $i)->get();


        for($i = 0; $i < sizeof($out); $i++){

           // $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
           // $out[$i]->created_at = $time;

        }

        return $out;

    /*
        return $this->db->where('buildID' , $i)
                        ->get();  
    */
    }

    //add building comment to DB
    public function addComment($data){
        
        $buildComment = new Building_comments();
        $buildComment->building_id = $data['buildID'];
        $buildComment->author = $data['authorName'];
        $buildComment->msg = $data['message'];

        $buildComment->save();

        return $buildComment;

    /*
        return $this->db->insert(
            [ 
                'CityID'      => $data['cityID'] ,
                'buildID'        => $data['buildID'] ,
                'author'          => $data['authorName'] , 
                'msg'           => $data['message']

                 ]
        );
    */
    }

    //get proposal object comment via ID
    public function getProposalObjectCommentsbyparentID($i){
        $out = Proposal_object_comments::where('proposal_object_id' , $i)->get();

        for($i = 0; $i < sizeof($out); $i++){

          //  $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
         //   $out[$i]->created_at = $time;
            
        }

        return $out;
        /*
        return $this->pocdb->where('parentID' , $i)
                    ->get();  
        */
    }

    //addd pproposal comment to DB
    public function addProposalComment($data){

        $proposalbuildComment = new Proposal_object_comments();
        $proposalbuildComment->proposal_object_id = $data['parentID'];
        $proposalbuildComment->author = $data['authorName'];
        $proposalbuildComment->msg = $data['msg'];

        $proposalbuildComment->save();

        return $proposalbuildComment;


/*

        return $this->pocdb->insert(
            [ 
                'parentID'        => $data['parentID'] ,
                'author'          => $data['authorName'] , 
                'msg'             => $data['msg']

                 ]
        );
*/
        
    }

    //get loacion pin comments via ID
    public function getGeoPositionComments($i){
        $out = Geo_Position_comments::where('geo_position_id' , $i)->get();

        for($i = 0; $i < sizeof($out); $i++){

         //   $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
         //   $out[$i]->created_at = $time;
            
        }
        
        return $out;
        
    }

    //add locaion pin comment
    public function addGeoPositionComments($data){
        $geoPositionComment = new Geo_Position_comments();
        $geoPositionComment->geo_position_id = $data['parentID'];
        $geoPositionComment->author = $data['authorName'];
        $geoPositionComment->msg = $data['msg'];

        $geoPositionComment->save();

        return $geoPositionComment;

    }
}