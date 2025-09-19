<?php

namespace App\Http\Filters;

class TerceroFilter extends QueryFilter
{
    protected $sortable = [];

    /**
     * Filter by `codcli` using LIKE.
     * Usage: ?codcli=ABC
     */
    public function codcli($value)
    {
        $term = trim((string) $value);
        if ($term === '') {
            return $this->builder;
        }

        $escaped = str_replace('%', '\\%', $term);
        $like = "%{$escaped}%";

        $this->builder->where('codcli', 'like', $like);
        return $this->builder;
    }

    /**
     * Filter by `Nombre_tercero` using LIKE.
     * Usage: ?nombre=Juan
     */
    public function nombre($value)
    {
        $term = trim((string) $value);
        if ($term === '') {
            return $this->builder;
        }

        $escaped = str_replace('%', '\\%', $term);
        $like = "%{$escaped}%";

        $this->builder->where('Nombre_tercero', 'like', $like);
        return $this->builder;
    }

    /**
     * Generic search that looks into `codcli` and `Nombre_tercero`.
     * Usage: ?search=ABC
     */
    public function search($value)
    {
        $term = trim((string) $value);
        if ($term === '') {
            return $this->builder;
        }

        $escaped = str_replace('%', '\\%', $term);
        $like = "%{$escaped}%";

        $this->builder->where(function ($q) use ($like) {
            $q->where('codcli', 'like', $like)
                ->orWhere('Nombre_tercero', 'like', $like);
        });

        return $this->builder;
    }
}
