import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

const INITIAL_PERKS = [
  {
    id: "perk_coffee",
    title: "$10 Campus Café & Bakery Voucher",
    vendor: "Peet's Coffee / Student Union Café",
    category: "Food & Drinks",
    creditCost: 2,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80",
    description: "Enjoy handcrafted espresso, matcha, and artisan croissants at any campus union location.",
    terms: "Redeemable at participating campus dining locations."
  },
  {
    id: "perk_dining",
    title: "All-You-Can-Eat Dining Hall Meal Pass",
    vendor: "Campus Residential Dining",
    category: "Meal Pass",
    creditCost: 3,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80",
    description: "1 Guest Meal Pass for any campus dining hall (Crossroads, Foothill, Clark Kerr).",
    terms: "Instant digital QR voucher upon redemption."
  },
  {
    id: "perk_boba",
    title: "$8 Boba / Smoothie Reward",
    vendor: "Campus Boba Spot & Juice Bar",
    category: "Food & Drinks",
    creditCost: 1,
    image: "https://images.unsplash.com/photo-1558857563-b37cf3e18a93?w=300&auto=format&fit=crop&q=80",
    description: "Treat yourself to brown sugar boba or fresh fruit smoothie after a long tutoring session.",
    terms: "Valid 30 days from redemption."
  },
  {
    id: "perk_bookstore",
    title: "$25 Campus Bookstore & Tech Card",
    vendor: "Official University Store",
    category: "Campus Gear",
    creditCost: 5,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&auto=format&fit=crop&q=80",
    description: "Use toward textbooks, stationary, Apple accessories, or collegiate apparel.",
    terms: "Sponsored by University Academic Dean's Honor Fund."
  }
];

// GET /api/perks - List all campus food & bookstore perks
router.get('/', (req, res) => {
  res.json({ success: true, count: INITIAL_PERKS.length, data: INITIAL_PERKS });
});

// POST /api/perks/:id/redeem - Redeem credits for food/café perk
router.post('/:id/redeem', (req, res) => {
  try {
    const { userId } = req.body;
    const perk = INITIAL_PERKS.find(p => p.id === req.params.id);
    if (!perk) {
      return res.status(404).json({ success: false, error: 'Campus perk not found' });
    }

    const user = store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    if (user.credits < perk.creditCost) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient credits. You need ${perk.creditCost} credits (You have ${user.credits} Cr). Teach more sessions to earn credits!` 
      });
    }

    user.credits -= perk.creditCost;
    store.saveData();

    const voucherCode = `SWAP-${perk.category.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      message: `🎉 Successfully redeemed ${perk.title}! Voucher: ${voucherCode}`,
      data: {
        perk,
        voucherCode,
        remainingCredits: user.credits
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
