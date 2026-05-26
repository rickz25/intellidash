<?php

namespace App\Console\Commands;

use App\Services\FraudService;
use Illuminate\Console\Command;

class GenerateFraudSnapshot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-fraud-snapshot';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(FraudService $fraudService)
    {
        $fraud = $fraudService->analyze();
        $this->info('Fraud snapshot generated successfully.');
    }
}
