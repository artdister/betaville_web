<?php

namespace App;


use Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'users';
    public $timestamps = true;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    

    public static function getRole(){

        
        $r = auth()->user()->role;
        if($r == 0){
            return "ordinary";
        }else
        if($r == 1){
            return "moderator";
        }else
        if($r == 2){
            return "admin";
        }


         
    }
}
