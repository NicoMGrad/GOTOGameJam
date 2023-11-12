import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('gotogamejam');
const adminsCollection = db.collection('admins');

const SALT_ROUNDS = 10;

async function saveAdmin(admin) {
    const hashedPassword = await bcrypt.hash(admin.password, SALT_ROUNDS);
    const newAdmin = {
        _id: new ObjectId(),
        username: admin.username,
        name: admin.name,
        password: hashedPassword
    };
    await client.connect();
    await adminsCollection.insertOne(newAdmin);
    return newAdmin;
}

async function adminExists(username) {
    await client.connect();
    const admin = await adminsCollection.findOne({ username });
    return Boolean(admin);
}

async function findAdminByUsername(username) {
    await client.connect();
    return adminsCollection.findOne({ username });
}

async function authenticateAdmin(username, password) {
    const admin = await findAdminByUsername(username);
    if (!admin) return null;
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return null;
    return admin;
}

async function getAdminById(id) {
    await client.connect();
    return adminsCollection.findOne({ _id: new ObjectId(id) });
}

export default {
    saveAdmin,
    adminExists,
    findAdminByUsername,
    authenticateAdmin,
    getAdminById
};