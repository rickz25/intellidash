<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiLog extends Model
{
    protected $fillable = [
        'user_id',
        'prompt',
        'response',
        'tokens_used',
        'request_type',
        'response_time',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
