<?php

namespace App\Observers;

use App\Models\AuditLog;

class AuditObserver
{
    public function created($model)
    {
        $this->log('created', $model, null, $model->getAttributes());
    }

    public function updated($model)
    {
        $this->log(
            'updated',
            $model,
            $model->getOriginal(),
            $model->getChanges()
        );
    }

    public function deleted($model)
    {
        $this->log(
            'deleted',
            $model,
            $model->getOriginal(),
            null
        );
    }

    protected function log($action, $model, $oldValues = null, $newValues = null)
    {
        // Prevent recursive logging
        if ($model instanceof AuditLog) {
            return;
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip' => request()?->ip(),
        ]);

        // Queue the logging to avoid slowing down the main request
        $data = [
            'user_id' => auth()->id(),
            'branch_id' => auth()->user()?->branch_id,
            'action' => $action,
            'model' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip' => request()?->ip(),
        ];

        dispatch(function () use ($data) {
            \App\Models\AuditLog::create($data);
        });
    }
}
