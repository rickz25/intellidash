<?php

namespace App\Data;

class ChartData
{
    public function __construct(
        public string $type,
        public string $title,
        public array $labels,
        public array $datasets,
    ) {}

    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'labels' => $this->labels,
            'datasets' => $this->datasets,
        ];
    }
}
