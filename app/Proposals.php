<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;


class Proposals extends Model
{
    use PostgisTrait;
    protected $table = 'proposals';
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
