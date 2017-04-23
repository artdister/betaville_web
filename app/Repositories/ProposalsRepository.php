<?php

namespace App\Repositories;

use DB;
use App\Proposals;
use App\Proposal_objects;


use Phaza\LaravelPostgis\Geometries\Point;

use App;
use Timezone;


class ProposalsRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */

    public function __construct()
    {

       $this->db = DB::table('proposals');
       $this->odb = DB::table('proposal_objects');

    }

    //get all proposals
    public function getAll()
    {

        $out = Proposals::all();
        $out;
        /*
        return $this->db
                    ->get();
        */
    }

    //get proposals via city ID
    public function getProposalByParentIndex($i){

        $out = Proposals::where('city_id' , $i)->where('onscene' , true)->get();

        $pos = DB::table('proposals')
                        ->select(DB::raw('ST_AsText(position) AS position'))
                        ->where('city_id' , $i)->where('onscene' , true)
                        ->get();

        for($i = 0; $i < sizeof($out); $i++){
            $out[$i]->position = $pos[$i]->position;

          //  $time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
          //  $out[$i]->created_at = $time;
        }



        return $out;
/*
        return $this->db->where('geo__positions_id' , $i)
                    ->get();
*/
    }

    //add proposal entry to DB
    public function addProposal($data){

        $proposal = new Proposals();
        $proposal->city_id =$data['parentId'];
        $proposal->author = $data['author'];
        $proposal->name = $data['name'] ;
        $proposal->position = new Point($data['lat'], $data['lng']);
        $proposal->atli = $data['atli'];
        $proposal->save();

        return $proposal;


    }

    //add proposal object
    public function addProposalObject($data, $objsrc, $imgsrc){

        $proposalObj = new Proposal_objects();
        $proposalObj->proposal_id = $data['parentID'];
        $proposalObj->name = 'ProposalObj:'.$data['name'];
        $proposalObj->author = $data['author'];
        $proposalObj->url = $objsrc;
        $proposalObj->preViewImgURL = $imgsrc;
        $proposalObj->scale =  $data['scale'];
        $proposalObj->atli = $data['atli'];

        $proposalObj->position = new Point($data['lat'], $data['lng']);

        $proposalObj->setRotation(array($data['rotatX'], $data['rotatY'], $data['rotatZ'] ) );
        $proposalObj->setQuaternion(array($data['quaternionW'],
                                            $data['quaternionX'],
                                                $data['quaternionY'],
                                                    $data['quaternionZ'] ) );
        if(!empty($data['hiddenbuildings'])){
            $proposalObj->sethiddenObj(explode(',', $data['hiddenbuildings']) );
        }else{
            $proposalObj->sethiddenObj(array() );
        }

        if(!empty($data['hiddenbuildingsLow'])){
            $proposalObj->sethiddenObjLow(explode(',', $data['hiddenbuildingsLow']) );
        }else{
            $proposalObj->sethiddenObjLow(array() );
        }

        $proposalObj->save();

        return $proposalObj;



    }

    //get proposal objects via proposal ID
    public function getProposalsObjectsByParentId($i){
        $out = Proposal_objects::where('proposal_id' , $i)->where('onscene' , true)->get();

        $pos = DB::table('proposal_objects')
                        ->select(DB::raw('ST_AsText(position) AS position'))
                        ->where('proposal_id' , $i)->where('onscene' , true)
                        ->get();

        for($j = 0; $j < sizeof($out); $j++){
            $out[$j]->position = $pos[$j]->position;
            $out[$j]->rotation = $out[$j]->getRotation();
            $out[$j]->quaternion = $out[$j]->getQuaternion();
            $out[$j]->hiddenbuildings = $out[$j]->gethiddenObj();
            $out[$j]->hiddenbuildingsLow = $out[$j]->gethiddenObjLow();
          //  $time = Timezone::convertFromUTC($out[$j]['created_at'], App::make('location')['timezone'] );
          //  $out[$j]->created_at = $time;
        }

        return $out;

/*
            return $this->odb->where('proposal_id' , $i)
                ->get();
*/
    }

    //move proposal to trash
    public function moveProposalToTrashByid($i){



        $file = Proposals::where('id' , $i)->first();

        $file->onscene = false;
        $file->save();


        return $file;

    }

    //move proposal object to trash
    public function moveBuildingToTrashByid($i){
        $trash = DB::table('proposal_objects_trash');

        $file = Proposal_objects::where('id' , $i)->first();



        $trash->insert(
            [
                'id'                => $file->id,
                'proposal_id'       => $file->proposal_id,
                'name'              => $file->name,
                'author'            => $file->author,
                'url'               => $file->url,
                'preViewImgURL'     => $file->preViewImgURL,
                'scale'             => $file->scale,
                'atli'              => $file->atli,
                'position'          => $file->position,
                'created_at'        => $file->created_at,
                'updated_at'        => $file->updated_at,
                'rotation'          => $file->rotation,
                'quaternion'        => $file->quaternion,
                'hiddenbuildings'   => $file->hiddenbuildings


            ]
        );

        $file->onscene = false;
        $file->save();


        return $file;

    }

    //get proposal trash list
    public function getBuildingFromTrash($i){
        $pId = Proposals::where('city_id' , $i)->value('id');

       return DB::table('proposal_objects_trash')->where('proposal_id',$pId)->get();
    }
}
