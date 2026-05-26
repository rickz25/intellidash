<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(User $user, string $device = 'api')
    {
        // revoke old tokens (optional security mode)
        // $user->tokens()->delete();

        return $user->createToken(
            $device,
            $user->role?->permissions ?? []
        )->plainTextToken;
    }

    public function validateCredentials($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        return $user;
    }
}
