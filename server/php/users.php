<?php
// SkillSwap PHP Users Query API Endpoint
// Fetches users & matching skills from SQL Database with search & filter parameters

require_once __DIR__ . '/config.php';

try {
    $search = trim($_GET['search'] ?? '');
    $category = trim($_GET['category'] ?? 'all');
    $school = trim($_GET['school'] ?? 'All Campuses');

    $sql = "SELECT DISTINCT u.* FROM users u LEFT JOIN skills s ON u.id = s.user_id WHERE 1=1";
    $params = [];

    if ($school !== 'All Campuses' && !empty($school)) {
        $sql .= " AND u.school = :school";
        $params[':school'] = $school;
    }

    if ($search !== '') {
        $sql .= " AND (LOWER(u.name) LIKE :search OR LOWER(u.major) LIKE :search OR LOWER(u.school) LIKE :search OR LOWER(s.name) LIKE :search)";
        $params[':search'] = '%' . strtolower($search) . '%';
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll();

    // Attach skills to each user
    $skillsStmt = $pdo->prepare("SELECT * FROM skills WHERE user_id = :user_id");

    foreach ($users as &$u) {
        $skillsStmt->execute([':user_id' => $u['id']]);
        $allSkills = $skillsStmt->fetchAll();

        $u['skillsOffered'] = array_values(array_filter($allSkills, fn($s) => $s['type'] === 'teach'));
        $u['skillsWanted'] = array_values(array_filter($allSkills, fn($s) => $s['type'] === 'learn'));
    }

    echo json_encode([
        'success' => true,
        'count' => count($users),
        'data' => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'SQL Database Error: ' . $e->getMessage()]);
}
?>
