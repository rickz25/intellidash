<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadedReport extends Model
{
    protected $fillable = [
        'uploaded_by',
        'file_name',
        'file_path',
        'report_type',
        'total_rows',
        'processed_rows',
        'failed_rows',
        'status',
        'remarks',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
