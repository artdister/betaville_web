<?php

namespace App\Repositories;

use DB;
use App\User;
use Carbon\Carbon;
use App;
use Timezone;
class UserRepository
{
    /**
     * Get all of the tasks for a given user.
     *
     * @param  User  $user
     * @return Collection
     */
    public function __construct()
    {
       
        $this->db = DB::table('users');
  
    }
    
    //get the current user role
    public function getRole(){

        return  User::getRole();
    }

    //get all users
    public function getAllUsers(){
        $out = User::all();

        for($i = 0;$i < sizeof($out);$i++){

            $recent_time = Timezone::convertFromUTC($out[$i]['recent_login'], App::make('location')['timezone'] );
            $out[$i]->recent_login = $recent_time;   

         //   $created_at_time = Timezone::convertFromUTC($out[$i]['created_at'], App::make('location')['timezone'] );
         //   $out[$i]->created_at = $created_at_time;  
        }

       
        return $out;
    }


    //edit the user 
    public function editUserMode($i){
        $out = User::where('id' , $i->id)
                ->update([  'role' => $i->mode, 
                            'name' => $i->username,
                            'email' =>$i->email]);
             




        return $out;

    }

    //set the last time login date
    public function setLoginData($id){
        $totalLogins = User::where('id' , $id)->select('total_logins')->get();
    
        $out = User::where('id' , $id)
                ->update([  'recent_login' => Carbon::now(),
                            'total_logins' => $totalLogins[0]['total_logins']+1]);


    }

}