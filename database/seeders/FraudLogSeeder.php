<?php

namespace Database\Seeders;

use App\Models\FraudLog;
use Illuminate\Database\Seeder;

class FraudLogSeeder extends Seeder
{
    public function run(): void
    {
        FraudLog::truncate();

        for ($i = 30; $i >= 0; $i--) {

            $date = now()->subDays($i);

            $riskScore = rand(10, 95);

            $riskLevel = match (true) {
                $riskScore >= 70 => 'HIGH',
                $riskScore >= 40 => 'MEDIUM',
                default => 'LOW',
            };

            FraudLog::create([
                'risk_score' => $riskScore,

                'risk_level' => $riskLevel,

                'high_discount_alerts' => rand(0, 20),

                'sales_spikes_count' => rand(0, 10),

                'suspicious_cashiers_count' => rand(0, 5),

                'meta' => [
                    'generated_by' => 'demo_seeder',
                    'simulation' => true,
                ],

                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }
}
