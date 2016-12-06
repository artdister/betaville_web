<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;


class Geo_Positions extends Model
{
    use PostgisTrait;
    protected $table = 'geo__positions';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'author',
        'position'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];

}
