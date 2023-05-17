<center><img src="https://github.com/insaid2018/Term-1/blob/master/Images/INSAID_Full%20Logo.png?raw=true" width="240" height="100" /></center>

<center><h1>Taskmate: Code Walkthrough</h1></center>

## **Project Structure:**

```
├── node_modules
├── models
|   └── taskmateDB.js
├── routes
|   └── task.js
├── server.js
├── package-lock.json
├── package.json
└── README.md
```

## 1. **`taskmateDB.js`**

```javascript
const mongoose = require("mongoose");

const taskmateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Task = mongoose.model("Task", taskmateSchema);

module.exports = Task;
```

- First, we import the `mongoose` module, which allows us to interact with MongoDB in our Node.js application.

- Then, we define a new Mongoose schema called `taskmateSchema` using the `mongoose.Schema` method. A schema is a blueprint that defines the structure and properties of our data model.

- Inside `taskmateSchema`, we define several fields that our tasks will have:

  - `title` field: It is of type `String` and is marked as `required: true`, which means that every task must have a title.
  - `description` field: It is of type `String` and is marked as `required: false`, indicating that it is an optional field and tasks can be created without a description.
  - `completed` field: It is of type `Boolean` and has a `default` value of `false`. This means that if we don't explicitly set the `completed` value when creating a task, it will be assumed as `false`.
  - `created_at` field: It is of type `Date` and has a `default` value set to `Date.now()`. This means that if we don't provide a specific creation date for a task, it will be automatically set to the current date and time.

- Additionally, we pass an options object `{ versionKey: false }` as the second argument to the `mongoose.Schema` method. This option is used to disable the default version key (`__v`) that Mongoose adds to documents. By setting it to `false`, we ensure that the version key won't be included in our task documents.

- Next, we create the `Task` model using the `mongoose.model` method, which takes two arguments: the model name as a string ("Task") and the schema object (`taskmateSchema`) we defined earlier. This model will serve as an interface to interact with the MongoDB collection that stores our tasks.

- Finally, we export the `Task` model from the module so that other parts of our application can use it.

## 2. **`task.js`**

```javascript
const express = require("express");
const mongoose = require("mongoose");

const Task = require("../models/taskmateDB");

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single task
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

// Create a new task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    created_at: req.body.created_at,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a task
router.patch("/:id", getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  if (req.body.completed != null) {
    res.task.completed = req.body.completed;
  }
  if (req.body.created_at != null) {
    res.task.created_at = req.body.created_at;
  }
  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

module.exports = router;
```

- This module is used to set up the routes for handling CRUD operations (Create, Read, Update, Delete) on tasks in the TaskMate Todo List app. It defines routes to get all tasks, get a single task, create a new task, update an existing task, and delete a task. The routes use the `Task` model and interact with the MongoDB database using Mongoose.

- We start by importing the necessary modules: `express` and `mongoose`. `express` is used for creating the router, and `mongoose` is needed to interact with the MongoDB database.

- We also import the `Task` model from the "../models/taskmateDB" file. This allows us to perform CRUD operations on the tasks in the MongoDB database.

- We then create an instance of the Express Router using `express.Router()` and assign it to the `router` constant.

- The `router` handles various HTTP routes for tasks, such as getting all tasks, getting a single task, creating a new task, updating a task, and deleting a task.

- The first route i.e. `router.get("/", async (req, res) => {...})` handles the GET request for retrieving all the tasks. It uses `Task.find()` to fetch all the tasks from the database. If successful, it responds with a JSON array of tasks. If there's an error, it responds with a status code 500 and an error message.

- The second route i.e. `router.get("/:id", getTask, (req, res) => {...})` handles the GET request for retrieving a single task by its ID (`req.params.id`). It uses a custom middleware function called `getTask`. This middleware function tries to find the task by its ID using `Task.findById()`. If the task is not found, it responds with a status code 404 and a "Task not found" message. If successful, it sets the found task to `res.task`, and the route handler responds with the task as JSON.

- The third route i.e. `router.post("/", async (req, res) => {...})` handles the POST request for creating a new task. It creates a new instance of the `Task` model with the data provided in the request body (`req.body`). It then saves the new task to the database using `task.save()`. If successful, it responds with a status code 201 and the newly created task as JSON. If there's a validation error or any other issue, it responds with a status code 400 and an error message.

- The fourth route i.e. `router.patch("/:id", getTask, async (req, res) => {...})` handles the PATCH request for updating a task by its ID. It uses the same `getTask` middleware function to find the task by ID. It checks for the presence of specific fields in the request body (`req.body`) and updates the corresponding fields in `res.task`. It then saves the updated task using `res.task.save()`. If successful, it responds with the updated task as JSON. If there's an error, it responds with a status code 400 and an error message.

- The fifth route i.e. `router.delete("/:id", async (req, res) => {...})` handles the DELETE request for deleting a task by its ID. It tries to delete the task using `Task.deleteOne()` based on the provided task ID (`req.params.id`). If the task is not found, it responds with a status code 404 and a "Task not found" message. If the deletion is successful, it responds with a JSON message indicating that the task has been deleted.

- The `getTask` function is an asynchronous middleware function used by routes that need to retrieve a task by ID. It attempts to find the task using `Task.findById(req.params.id)`. If the task is not found, a 404 error response is sent. If an error occurs during the retrieval, a 500 error response is sent. If the task is found, it is stored in `res.task`, and the control is passed to the next middleware or route handler.

- Finally, we export the `router` so that it can be used in other parts of our application.

## 3. **`server.js`**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRouter = require("./routes/task");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/tasks", taskRouter);

const dbUrl = "mongodb://127.0.0.1:27017/taskmateDB";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to TaskMate");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

- `server.js` sets up the server for the TaskMate Todo List app. It configures middleware for request parsing and Cross-Origin Resource Sharing, establishes a connection to the MongoDB database using Mongoose, sets up the routes for handling tasks by using the `taskRouter`, and starts the server to listen for incoming requests on the specified port.

- We begin by importing the necessary modules: `express`, `body-parser`, `mongoose`, `cors`, and the `taskRouter` from "./routes/task".

- We then create an instance of the Express application by calling `express()` and assign it to the `app`, which represents our server.

3. Then, we use `bodyParser.json()` middleware to parse incoming request bodies in JSON format. `app.use(bodyParser.json())` is used to set up this middleware in our application.

4. Next, we use the `cors()` middleware to enable Cross-Origin Resource Sharing, allowing requests from different domains, and `app.use(cors())` is used to enable it in our application.

5. We then set up the route handling for the "/tasks" URL path using `app.use("/tasks", taskRouter)`. This means that all routes defined in the `taskRouter` will be accessible under the "/tasks" path.

6. Next, we define the `dbUrl` variable, which contains the URL for connecting to the MongoDB database. In this case, it's set to "mongodb://127.0.0.1:27017/taskmateDB", indicating the local MongoDB server and the name of the database as "taskmateDB".

7. We use `mongoose.connect()` to establish a connection to the MongoDB database specified by the `dbUrl`. We pass in options `{ useNewUrlParser: true, useUnifiedTopology: true }` to ensure the use of the new URL parser and the new server discovery and monitoring engine. The `connect()` method returns a promise, so we use `.then()` to log a success message if the connection is established and `.catch()` to log any errors that occur during the connection.

8. We also define a route handler for the root path ("/") of our server. When a GET request is made to the root path, the server responds with the message "Welcome to TaskMate".

9. Next, we define the `PORT` variable, which determines the port number on which the server will listen. It uses the value of the environment variable `process.env.PORT`, and if not available, defaults to port 3000.

10. Finally, we call the `app.listen()` method to start the server. It listens for incoming requests on the specified `PORT`. Once the server is running, the message "Server is running on port ${PORT}" is logged to the console.
