<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;

use Smiarowski\Postgres\Model\Traits\PostgresArray;

class DatasetsGeom extends Model
{
    use PostgisTrait;

    use PostgresArray;

    protected $table = 'datasets_geom';
    public $timestamps = true;

    protected $fillable = [
    ];

    protected $postgisFields = [
    ];

/*
    public function setTagNames(array $value)
    {
        $this->tagsnames = self::mutateToPgArray($value);
    }
    public function getTagNames()
    {
        return self::accessPgArray($this->tagsnames);
    }

    public function setTagValues(array $value)
    {
        $this->tagsvalues = self::mutateToPgArray($value);
    }
    public function getTagValues()
    {
        return self::accessPgArray($this->tagsvalues);
    }
*/

}
