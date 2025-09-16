<?php

namespace App\Http\Filters;

class MovimientoCilindroFilter extends QueryFilter
{
    protected $sortable = [
        'name',
        'email',
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at',
    ];

    /**
     * Filter by `docto` field using a LIKE query.
     * Usage: ?docto=ABC
     *
     * @param string $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function docto($value)
    {
        $term = trim((string) $value);
        if ($term === '') {
            return $this->builder;
        }

        // basic escape for percent sign to avoid unintended wildcards
        $escaped = str_replace('%', '\\%', $term);
        $like = "%{$escaped}%";

        return $this->builder->where('docto', 'like', $like);
    }
}
