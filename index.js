const express = require('express')
const app = express();
const cors = require('cors')
var jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 3000;
// 0zr8yVmOlJFilu4L
//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2a6yz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const usersCollection = client.db("handsonDB").collection("users")
        const eventCollection = client.db("handsonDB").collection("events")
        const contributionCollection = client.db("handsonDB").collection("contributions")
        const communityHelpCollection = client.db("handsonDB").collection("communityHelp")
        const communityHelpMessageCollection = client.db("handsonDB").collection("communityHelpMessage")
        const teamCollection = client.db("handsonDB").collection("teams")
        const teamRequestCollection = client.db("handsonDB").collection("teamRequest")
        const teamDiscussionCollection = client.db("handsonDB").collection("teamDiscussion")

        // jwt apis
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1h'
            })
            res.send({ token })
        })
        // MIDDLWARE
        const verifyTeamPermission = async (req, res, next) => {
            const find = await teamCollection.findOne({ _id: new ObjectId(req.query.id) })
            if (find.membership === "private") {
                const query = await teamRequestCollection.findOne({ id: req.query.id }, { uid: req.query.uid })
                if (query) {

                    if (query.permission === "pending") {
                        const status = "Request Send For Permission"
                        return res.send(status)
                    }
                    else {
                        next()
                    }

                }
                else {
                    const status = "Permission Denied"
                    return res.send(status)
                }
            }
            else {
                const query = await teamRequestCollection.findOne({ id: req.query.id }, { uid: req.query.uid })
                if (query) {
                    return next()
                }
                else {
                    const addMember = {
                        id: req.query.id,
                        email: req.query.email,
                        uid: req.query.uid,
                        permission: "done"
                    }
                    const result = await teamRequestCollection.insertOne(addMember)
                    if (result) {
                        return next()
                    }
                }
            }
        }
        const verifyToken = async (req, res, next) => {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "Forbidden Access" })
            }
            else {
                const token = (req.headers.authorization).split(' ')[1]
                jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
                    if (err) {
                        res.status(401).send({ message: 'Forbidden Access' })
                    }
                    else {
                        req.decoded = decoded
                        next()
                    }
                })
            }

        }
        app.get('/', async (req, res) => {
            res.send("Server is Running")
            console.log("Server is Running")
        })

        //events api

        // events create api
        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event)
            return res.send(result)
        })
        // all events read api
        app.get('/events', async (req, res) => {
            const { location, category, availability } = req.query;
            const query = {}
            if (location) {
                query.location = { $regex: new RegExp(location, 'i') }
            }
            if (category) {
                query.category = { $regex: new RegExp(category, 'i') }
            }
            if (availability === "true") {
                query.eventDate = { $gt: new Date().toISOString().slice(0, 16) };
                // console.log(query.eventDate)
            }
            if (availability === "false") {
                query.eventDate = { $lt: new Date().toISOString().slice(0, 16) };
            }
            const result = await eventCollection.find(query).sort({ _id: -1 }).toArray()


            return res.send(result)
        })
        // events by user api
        app.get('/events/user/:uid', verifyToken, async (req, res) => {
            const result = await eventCollection.find({ uid: req.params.uid }).sort({ eventDate: -1 }).toArray()
            // console.log(result)
            return res.send(result)
        })
        // events by id api
        app.get('/events/:id', verifyToken, async (req, res) => {
            const result = await eventCollection.findOne({ _id: new ObjectId(req.params.id) })
            return res.send(result)
        })

        // community help api
        // all community help read api
        app.get('/communityhelp', async (req, res) => {
            const { location, urgency, availability } = req.query;
            const query = {}
            if (location) {
                query.location = { $regex: new RegExp(location, 'i') }
            }
            if (urgency) {
                query.urgency = { $regex: new RegExp(urgency, 'i') }
            }
            if (availability === "true") {
                query.eventDate = { $gt: new Date().toISOString().slice(0, 16) };
                // console.log(query.eventDate)
            }
            if (availability === "false") {
                query.eventDate = { $lt: new Date().toISOString().slice(0, 16) };
            }
            const result = await communityHelpCollection.find(query).sort({ _id: -1 }).toArray()


            return res.send(result)
        })
        // community help create api
        app.post('/communityhelp', verifyToken, async (req, res) => {
            const communityHelp = req.body;
            const result = await communityHelpCollection.insertOne(communityHelp)
            return res.send(result)
        })

        // communityhelpmessage api
        // communityhelpmessage by user api
        app.post('/communityhelpmessage', verifyToken, async (req, res) => {
            const message = req.body;
            const find = await communityHelpMessageCollection.find(message).toArray()
            if (find.length !== 0) {
                const result = "You Already Message"
                return res.send(result)
            }
            else {
                const result = await communityHelpMessageCollection.insertOne(message)
                return res.send(result)
            }
        })
        // communityhelpmessage read by creator api
        app.get('/communityhelpmessage/:creator', verifyToken, async (req, res) => {
            const result = await communityHelpMessageCollection.find().sort({_id: -1}).toArray()
            return res.send(result)
        })


        // contribution api
        // contribution read by user api
        app.get('/contribution', async (req, res) => {
            const find = await contributionCollection.find().toArray()
            return res.send(find)
        })
        app.get('/contribution/user/:uid', verifyToken, async (req, res) => {
            const result = await contributionCollection.find({ uid: req.params.uid }).toArray()
            return res.send(result)
        })
        // contribution join by user api
        app.post('/contribution', verifyToken, async (req, res) => {
            const contribution = req.body;
            const find = await contributionCollection.find(contribution).toArray()
            if (find.length !== 0) {
                const result = "You Already Joined"
                return res.send(result)
            }
            else {
                const result = await contributionCollection.insertOne(contribution)
                return res.send(result)
            }
        })

        // team related api
        // create team
        app.post('/team', verifyToken, async (req, res) => {
            const result = await teamCollection.insertOne(req.body)
            return res.send(result)
        })
        // get team data
        app.get('/team', async (req, res) => {
            if (req.query.leaderboard) {
                const result = await teamCollection.find().sort({ post: -1 }).toArray()
                return res.send(result)
            }
            else {
                const result = await teamCollection.find().sort({ _id: -1 }).toArray()
                return res.send(result)
            }
        })

        // teamrequest api
        app.post('/teamrequest', verifyToken, async (req, res) => {
            const result = await teamRequestCollection.insertOne(req.body)
            res.send(result)
        })
        app.patch('/teamrequest', verifyToken, async (req, res) => {
            const { id, email, uid } = req.body;
            const filter = { id, email, uid };
            const find = await teamRequestCollection.findOne(filter);

            if (find) {
                const result = await teamRequestCollection.updateOne(
                    filter,
                    { $set: req.body }
                );
                return res.send(result);
            } else {
                const result = await teamRequestCollection.insertOne(req.body);
                return res.send(result);
            }

        })
        // teamrequest get  by team id
        app.get('/teamrequest/:id', verifyToken, async (req, res) => {
            const result = await teamRequestCollection.find({ id: req.params.id, permission: "done" }).toArray()
            // console.log(result)
            res.send(result)
        })

        // teamdiscussion
        // teamdiscussion create
        app.post('/teamdiscussion', verifyToken, async (req, res) => {
            const result = await teamDiscussionCollection.insertOne(req.body);

            const updateResult = await teamCollection.updateOne(
                { _id: new ObjectId(req.body.id) },
                {
                    $inc: { post: 1 }
                },
                { upsert: true }
            );

            res.send(result);
        })
        // teamdiscussion get
        app.get('/teamdiscussion/:id', verifyToken, async (req, res) => {
            const result = await teamDiscussionCollection.find({ id: req.params.id }).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // get by owner
        app.get('/teamowner', verifyToken, async (req, res) => {
            const result = await teamCollection.find({ email: req.query.email }).toArray()
            return res.send(result)
        })
        // get  team data by id
        app.get('/teamdetails', verifyTeamPermission, async (req, res) => {
            const result = await teamCollection.findOne({ _id: new ObjectId(req.query.id) })
            return res.send(result)
        })




        // users api
        app.get('/users/:uid', async (req, res) => {
            const result = await usersCollection.findOne({ uid: req.params.uid })
            res.send(result)
        })
        // src user api
        app.get('/users', async (req, res) => {
            if (req.query.src) {
                const result = await usersCollection.find({ email: { $regex: req.query.src, $options: "i" } }).toArray()
                return res.send(result)
            }
            else {
                const result = await usersCollection.find().sort({ log: -1 }).toArray();
                return res.send(result);
            }
        })

        // get user for set user
        app.get('/user/:email', async (req, res) => {
            const result = await usersCollection.findOne({ email: req.params.email })
            res.send(result)
        })

        // user add api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { uid: user.uid }
            const checkUsersDB = await usersCollection.findOne(query);

            if (checkUsersDB) {
                return res.send({ insertedId: null })

            }
            else {
                const result = await usersCollection.insertOne(user)
                return res.send(result)
            }
        })
        app.patch('/update/:uid', verifyToken, async (req, res) => {
            const update = await usersCollection.updateOne({ uid: req.params.uid }, { $set: req.body })
            res.send(update)
        })
        app.patch('/users/log', verifyToken, async (req, res) => {

            const update = await usersCollection.updateOne(
                { uid: req.body.uid },
                {
                    $inc: { log: req.body.log }
                },
                { upsert: true }
            );

            res.send(update);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Server is running on", port)
})