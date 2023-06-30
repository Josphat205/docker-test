import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
const app = express();
const port = process.env.PORT || 3000;
import multer from 'multer';
import mongodb from 'mongodb';
const upload = multer({dest: 'uploads/'});
const {MongoClient} = mongodb;

// Connection URL
const url = 'mongodb://loman:12345@localhost:27017';
const client = MongoClient.connect(url);  

//middleware
app.use(bodyParser.json());

app.post('/register',upload.single('avatar'), async(req, res) => {
    const {email, password, name} = req.body;
    const {avatar} = req.file;
    const hashedpass = await bcrypt.hash(password, 10);
    const db = (await client).db("auth-service");
    const collection = db.collection('users');
    const ExistUser = await collection.findOne({email});
    if(ExistUser) {
        return res.status(400).json({message: 'User already exists'});
    }
    const user = {
        email,
        password: hashedpass,
        name,
        avatar
    }
    const result = await collection.insertOne(user);
    console.log(result.insertedId);
    return res.json(result.insertedId);
});


//get all users
app.get('/users', async(req, res) => {
    const db = (await client).db("auth-service");
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    return res.json(users);
});

//delete user
app.delete('/users/:id', async(req, res) => {
    const {id} = req.params;
    const db = (await client).db("auth-service");
    const collection = db.collection('users');
    const result = await collection.deleteOne({_id: mongodb.ObjectID(id)});
    return res.json(result);
});

app.listen(port, () => {
    console.log(`Auth service listening on port ${port}!`);
    }
);