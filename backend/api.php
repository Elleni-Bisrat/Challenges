<?php
require 'config.php';

$request = $_SERVER['REQUEST_METHOD'];

switch ($request) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            if ($data['action'] == 'verify_passcode') {
                verifyPasscode($data['passcode']);
            } elseif ($data['action'] == 'add_person') {
                addPerson($data);
            }
        }
        break;

    case 'GET':
        if (isset($_GET['action'])) {
            if ($_GET['action'] == 'get_people') {
                getPeople();
            }
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action']) && $data['action'] == 'delete_person' && isset($data['id'])) {
            deletePerson($data['id']);
        }
        break;

    default:
        echo json_encode(["message" => "Invalid request"]);
        break;
}

function verifyPasscode($passcode) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM admin WHERE passcode = :passcode");
    $stmt->execute(['passcode' => $passcode]);
    echo json_encode([
        "success" => $stmt->rowCount() > 0,
        "message" => $stmt->rowCount() > 0 ? "Authorized" : "Invalid passcode"
    ]);
}

function addPerson($data) {
    global $conn;

    $imagePath = '';
    if (isset($data['image'])) {
        $imageData = $data['image'];
        $imageParts = explode(";base64,", $imageData);
        
        if (count($imageParts) == 2) {
            $imageBase64 = base64_decode($imageParts[1]);
            $imageExt = explode('/', explode(':', $imageParts[0])[1])[1]; // png, jpeg
            $imageName = uniqid() . '.' . $imageExt;
            $imagePath = 'uploads/' . $imageName;

            // Save image to uploads/ directory
            file_put_contents($imagePath, $imageBase64);
        }
    }

    $stmt = $conn->prepare("INSERT INTO users (name, email, phone, image_path) VALUES (:name, :email, :phone, :image_path)");
    $stmt->execute([
        'name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
        'image_path' => $imagePath
    ]);

    echo json_encode(["success" => true, "message" => "Person added successfully"]);
}

function getPeople() {
    global $conn;
    $stmt = $conn->query("SELECT * FROM users ORDER BY id DESC");
    $people = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($people);
}

function deletePerson($id) {
    global $conn;

    $stmt = $conn->prepare("SELECT image_path FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['image_path'] && file_exists($user['image_path'])) {
        unlink($user['image_path']);
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(["success" => true, "message" => "Person deleted successfully"]);
}
?>
