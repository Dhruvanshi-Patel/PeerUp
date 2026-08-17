<?php
// SkillSwap PHP User Registration API Endpoint
// Validates unique email and name constraints in SQL database before inserting profile

require_once __DIR__ . '/config.php';

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
    exit();
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? 'password123');
$school = trim($input['school'] ?? 'UC Berkeley');
$major = trim($input['major'] ?? 'Computer Science');
$bio = trim($input['bio'] ?? 'Excited to trade skills and learn from peers on campus!');
$avatar = trim($input['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Student Name and Email address are required.']);
    exit();
}

try {
    // 1. Uniqueness Validation Query: Check if email OR name already exists in SQL Database
    $checkStmt = $pdo->prepare("SELECT id, name, email FROM users WHERE LOWER(email) = LOWER(:email) OR LOWER(name) = LOWER(:name)");
    $checkStmt->execute([':email' => $email, ':name' => $name]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        if (strtolower($existing['email']) === strtolower($email)) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'error' => "An account with the email address '{$email}' already exists. Please sign in instead."
            ]);
            exit();
        }
        if (strtolower($existing['name']) === strtolower($name)) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'error' => "A student profile with the name '{$name}' already exists. Please use a distinct profile name."
            ]);
            exit();
        }
    }

    // 2. Insert new user into SQL database
    $userId = 'usr_' . round(microtime(true) * 1000);
    $insertStmt = $pdo->prepare("
        INSERT INTO users (id, name, email, password, school, major, bio, avatar, credits, karma, rating, review_count, hours_taught, hours_learned, streak, badge_level)
        VALUES (:id, :name, :email, :password, :school, :major, :bio, :avatar, 5, 150, 5.0, 0, 0, 0, 1, 'Verified Contributor')
    ");

    $insertStmt->execute([
        ':id' => $userId,
        ':name' => $name,
        ':email' => $email,
        ':password' => $password,
        ':school' => $school,
        ':major' => $major,
        ':bio' => $bio,
        ':avatar' => $avatar
    ]);

    // 3. Insert skills offered & wanted
    $skillsOffered = $input['skillsOffered'] ?? [];
    $skillStmt = $pdo->prepare("
        INSERT INTO skills (id, user_id, type, name, category, level, priority)
        VALUES (:id, :user_id, :type, :name, :category, :level, :priority)
    ");

    foreach ($skillsOffered as $skill) {
        $skillId = 'sk_' . round(microtime(true) * 1000) . rand(100, 999);
        $skillStmt->execute([
            ':id' => $skillId,
            ':user_id' => $userId,
            ':type' => 'teach',
            ':name' => $skill['name'] ?? 'General Tutoring',
            ':category' => $skill['category'] ?? 'Coding & Tech',
            ':level' => $skill['level'] ?? 'Intermediate',
            ':priority' => 'High'
        ]);
    }

    // Fetch newly created user record from database
    $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $userStmt->execute([':id' => $userId]);
    $newUser = $userStmt->fetch();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => "Student profile registered successfully for {$name}!",
        'data' => $newUser
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'SQL Execution Error: ' . $e->getMessage()]);
}
?>
