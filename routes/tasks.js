var Todo = require('./../models/dbmodel');
/*
 * GET users listing.
 */
// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos


// api ---------------------------------------------------------------------
// get all todos
exports.list = function (req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function (err, todos) {
        console.log('Finding ToDos...');
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);

        res.json(todos); // return all todos in JSON format
    });
};

// create todo and send back all todos after creation
exports.add = function (req, res) {
    console.log('Adding ToDos...');
    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.body.text,
        done: false
    }, function (err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });

};

// delete a todo
exports.delete = function (req, res) {
    console.log('Deleting ToDos...');
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });
};

