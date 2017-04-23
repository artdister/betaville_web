<?php

namespace App\Http\Controllers;


use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;

use Auth;
use URL;
use View;

//Class to manage users
class UserController extends Controller
{	



    public function __construct(UserRepository $user)
    {
        //$this->middleware('auth');
    	$this->user = $user;
    }

    //get all users
    public function getAllUsers(){
    	$users = $this->user->getAllUsers();

        $sections = view('menu.usersub.userManager')
                    ->with('data', $users )
                    ->renderSections();
    

        return  $sections['userManager'];
    }

    //get the user role
	public function getRole(){
		return $this->user->getRole();

	}

    //on login
    public function login(Request $request)
    {   
        //if request is 'post' create user object
        if ($request->isMethod('post')){

            $auth = false;
            $credentials = $request->only('email', 'password');

            //if login success 
            if (auth()->attempt($credentials, $request->has('remember'))) {
               
                $auth = true; 
                auth()->loginUsingId(auth()->user()->id);
                $this->user->setLoginData(auth()->user()->id);

                //return the user object
                return response()->json([
                    'auth' => $auth,
                    'intended' => URL::previous(),
                    'role' => auth()->user()->role
                ]);
        


            }

        
        
        
       
        }

        //if request is 'get' 
        if ($request->isMethod('get')){
            //if the user is login
            if(auth()->check() ){

            //return user menu
              auth()->user()->rolestr = $this->user->getRole();
              $sections = view('menu.userMenu')->renderSections();
              return $sections['userMenu'];

            }else{
                //return guest menu
              $sections = view('menu.guestMenu')->renderSections();
              return $sections['guestMenu'];
              
            }
        }

    }

    //change user role
    function editUserMode(Request $request){

        return $this->user->editUserMode($request);
    

    }

}
