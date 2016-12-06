<?php

namespace App\Providers;
use DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

use App;
use GeoIP;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {   

        ini_set('memory_limit', -1);
        ini_set('max_execution_time', 600);



        $cities = DB::table('cities')->get();
        view()->share('cities', $cities);

         if (!\App::environment('local')) {
          \URL::forceSchema('https');
        }

        App::singleton('location', function($app)
        {
            $ip = new Request;
            $location = GeoIP::getLocation($ip->ip);

            return $location;
        });

    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
