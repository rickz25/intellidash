<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $user = User::create([
            ...$request->all(),
            'password' => Hash::make($request->password),
        ]);

        $token = $this->authService->login($user, 'register-device');

        return response()->json([
            'message' => 'User created successfully',
            'token' => $token,
            'user' => $user->load('role', 'branch'),
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'nullable|string',
        ]);

        $user = $this->authService->validateCredentials(
            $request->email,
            $request->password
        );

        if (! $user) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user->update([
            'last_login_at' => now(),
        ]);

        $token = $this->authService->login(
            $user,
            $request->device_name ?? 'api-device'
        );

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->load('role', 'branch'),
            'permissions' => $user->permissions,
        ]);
    }

    // PROFILE
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('role', 'branch'),
            'permissions' => $request->user()->permissions,
        ]);
    }

    // LOGOUT (current device)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out from current device',
        ]);
    }

    // LOGOUT ALL DEVICES
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices',
        ]);
    }

    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required',
        ]);

        $token = RefreshToken::where('token', $request->refresh_token)
            ->where('expires_at', '>', now())
            ->first();

        if (! $token) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        $user = $token->user;

        return response()->json([
            'token' => $user->createToken('access')->plainTextToken,
        ]);
    }
}
