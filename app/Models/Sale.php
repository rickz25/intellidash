<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'branch_id',
        'invoice_no',
        'customer_name',
        'transaction_date',
        'subtotal',
        'tax',
        'discount',
        'total_amount',
        'payment_method',
        'status',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'datetime',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * CLEAN SERVICE STYLE CHECKOUT (IMPORTANT FIX)
     */
    public static function checkout(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1. Create Sale
            $sale = self::create([
                'branch_id' => $data['branch_id'],
                'invoice_no' => $data['invoice_no'] ?? null,
                'customer_name' => $data['customer_name'] ?? null,
                'transaction_date' => now(),
                'subtotal' => $data['subtotal'] ?? 0,
                'tax' => $data['tax'] ?? 0,
                'discount' => $data['discount'] ?? 0,
                'total_amount' => $data['total'],
                'payment_method' => $data['payment_method'] ?? 'Cash',
                'status' => 'completed',
                'created_by' => $data['created_by'] ?? null,
            ]);

            // 2. Process Items
            foreach ($data['items'] as $item) {

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['qty'],
                    'unit_price' => $item['price'],
                    'total' => $item['qty'] * $item['price']
                ]);

                // 3. Stock update (safe atomic operation)
                Product::where('id', $item['product_id'])
                    ->decrement('stock_quantity', $item['qty']);
            }

            return $sale;
        });
    }

    // public function checkout($data)
    // {
    //     DB::transaction(function () use ($data) {

    //         $sale = Sale::create([
    //             'branch_id' => $data['branch_id'],
    //             'total_amount' => $data['total'],
    //             'status' => 'completed'
    //         ]);

    //         foreach ($data['items'] as $item) {

    //             SaleItem::create([
    //                 'sale_id' => $sale->id,
    //                 'product_id' => $item['product_id'],
    //                 'quantity' => $item['qty'],
    //                 'unit_price' => $item['price'],
    //                 'total' => $item['qty'] * $item['price']
    //             ]);

    //             Product::where('id', $item['product_id'])
    //                 ->decrement('stock_quantity', $item['qty']);
    //         }
    //     });
    // }
}
