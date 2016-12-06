<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use Config;
use App;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;

use App\Repositories\LocationRepository;

use GeoIP;

class LocationController extends Controller
{

	protected $locations;
    public function __construct(LocationRepository $location){


        $this->locations = $location;

    }


    public function getTimeLocation()
    {
        $ip = new Request;
        $location = GeoIP::getLocation($ip->ip);
        return $location;
    }

    public function getCitySections(Request $r)
    {
    	$out = $this->locations->getLocationsByCityID($r->id);

    	return $out;

    }
}