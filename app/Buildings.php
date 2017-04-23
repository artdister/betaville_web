<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;

use Smiarowski\Postgres\Model\Traits\PostgresArray;

class Buildings extends Model
{
    use PostgisTrait;

    use PostgresArray;


    protected $table = 'buildings';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'author',
        'URL',
        'scale',
        'atli',
        'position',
        'rotation'
      //  'quaternion'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];

    protected $casts = [
     //   'rotation' => 'array'
     //   'quaternion' => 'json'
    ];


    /**
     * Accessor for postgres array field, creates php array from postgres array
     * @return array
     */

    //set the rotation, added via laravel-postgres module
    public function setRotation(array $value)
    {
        $this->rotation = self::mutateToPgArray($value);
    }

    //get the rotation, added via laravel-postgres module
    public function getRotation()
    {
        return self::accessPgArray($this->rotation);
    }


    //set the Quaternion, added via laravel-postgres module
    public function setQuaternion(array $value)
    {
        $this->quaternion = self::mutateToPgArray($value);
    }

    //get the Quaternion, added via laravel-postgres module
    public function getQuaternion()
    {
        return self::accessPgArray($this->quaternion);
    }


    //set the objects to hide, added via laravel-postgres module
    public function sethiddenObj(array $value)
    {
        $this->hiddenBuildData = self::mutateToPgArray($value);
    }

    //get the objects to hide, added via laravel-postgres module
    public function gethiddenObj()
    {
        return self::accessPgArray($this->hiddenBuildData);
    }
}
