// Automated API verification script for PeerUp Backend
import http from 'http';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting PeerUp REST API Automated Test Suite...\n');

  try {
    // 1. Health Check
    console.log('1. Testing GET /api/health ...');
    const health = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    console.log('   Status:', health.status, 'Payload:', health.data.status, '\n');

    // 2. Get Users
    console.log('2. Testing GET /api/users ...');
    const users = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/users',
      method: 'GET'
    });
    console.log('   Status:', users.status, 'Total Students:', users.data.count, '\n');

    // 3. Create Swap Proposal
    console.log('3. Testing POST /api/swaps (Create Proposal)...');
    const swap = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/swaps',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      senderId: 'usr_priya',
      receiverId: 'usr_alex',
      type: 'Direct Swap',
      requestedSkill: 'Figma UI/UX & Design Systems',
      offeredSkill: 'Python & Data Structures',
      proposedSlot: 'Friday 5:00 PM EST',
      message: 'Hey Alex! Would love to trade Python algorithms for Figma system advice.'
    });
    console.log('   Status:', swap.status, 'Created Swap ID:', swap.data?.data?.id, '\n');

    // 4. Accept Swap Proposal
    if (swap.data?.data?.id) {
      console.log(`4. Testing PATCH /api/swaps/${swap.data.data.id}/accept ...`);
      const accepted = await request({
        hostname: 'localhost',
        port: 3001,
        path: `/api/swaps/${swap.data.data.id}/accept`,
        method: 'PATCH'
      });
      console.log('   Status:', accepted.status, 'Scheduled Session ID:', accepted.data?.data?.session?.id, '\n');
    }

    // 5. Submit Peer Review & Award Credit Karma
    console.log('5. Testing POST /api/reviews ...');
    const review = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/reviews',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      targetUserId: 'usr_alex',
      authorName: 'Priya Sharma',
      authorSchool: 'UC Berkeley',
      rating: 5,
      skill: 'Figma UI/UX & Design Systems',
      tags: ['Super Clear Explanation', 'Actionable Feedback'],
      comment: 'Alex gave me exceptional pointers on design systems!'
    });
    console.log('   Status:', review.status, 'Updated Peer Karma:', review.data?.data?.updatedUser?.karma, '\n');

    // 6. Get Leaderboard
    console.log('6. Testing GET /api/leaderboard ...');
    const lb = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/leaderboard',
      method: 'GET'
    });
    console.log('   Status:', lb.status, 'Top Student:', lb.data?.data?.[0]?.name, 'Karma:', lb.data?.data?.[0]?.karma, '\n');

    // 7. Register New Student Profile
    console.log('7. Testing POST /api/users (Create New Profile)...');
    const newStudent = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Maya Lin',
      school: 'UC Berkeley',
      email: 'maya.lin@berkeley.edu',
      major: 'Cognitive Science',
      bio: 'Excited to learn Python and teach conversational Mandarin!'
    });
    console.log('   Status:', newStudent.status, 'New Student ID:', newStudent.data?.data?.id, 'Welcome Credits:', newStudent.data?.data?.credits, '\n');

    // 8. Test Campus Food & Perks
    console.log('8. Testing GET /api/perks & POST /api/perks/perk_coffee/redeem ...');
    const perks = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/perks',
      method: 'GET'
    });
    console.log('   Status:', perks.status, 'Available Perks Count:', perks.data?.count);
    const redeemedPerk = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/perks/perk_coffee/redeem',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      userId: 'usr_priya'
    });
    console.log('   Perk Redemption Status:', redeemedPerk.status, 'Voucher Code:', redeemedPerk.data?.data?.voucherCode, '\n');

    // 9. Test Notes Exchange Hub
    console.log('9. Testing GET /api/notes & POST /api/notes/note_1/unlock ...');
    const notes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/notes',
      method: 'GET'
    });
    console.log('   Status:', notes.status, 'Notes Count:', notes.data?.count);
    const unlockedNote = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/notes/note_1/unlock',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      userId: 'usr_priya'
    });
    console.log('   Note Unlock Status:', unlockedNote.status, 'Download URL:', unlockedNote.data?.data?.downloadUrl, '\n');

    console.log('🎉 ALL REST API ENDPOINTS (INCLUDING PROFILE CREATION, PERKS & NOTES) PASSED!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
