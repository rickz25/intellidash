<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = $request->user();

        if (! $user || ! $user->role) {
            abort(403, 'Unauthorized');
        }

        $permissions = $user->role->permissions ?? [];

        if (! is_array($permissions)) {
            $permissions = [];
        }

        if (! in_array('*', $permissions, true) && ! in_array($permission, $permissions, true)) {
            abort(403, 'Forbidden (Permission denied)');
        }

        return $next($request);
    }
}
