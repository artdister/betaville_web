<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;

use Smiarowski\Postgres\Model\Traits\PostgresArray;


class Datasets extends Model
{
    use PostgisTrait;

    use PostgresArray;

    protected $table = 'datasets';
    public $timestamps = true;

    protected $fillable = [
        'name'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];



}
