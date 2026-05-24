<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        AuditLog::create([
            'user_id' => auth()->id(),
            'branch_id' => auth()->user()?->branch_id,
            'action' => 'request',
            'ip' => $request->ip(),
            'new_values' => [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
            ],
        ]);

        return $response;
    }
}
