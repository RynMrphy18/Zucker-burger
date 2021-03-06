const { User, Thought } = require('../models');

// controller for all user related functions
const userController = {

    // get list of all users
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err=> {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id})
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({path:'friends', select: '-__v'})
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user with this id was found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create a new user via the body
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => {
                res.json(dbUserData)
            })
            .catch(err => res.json(err));
    },
    
    // find existing user and update it
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            {_id: params.id}, body, { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user with this id was found!'});
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete existing user
    deleteUser( {params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id was found!'});
                return;
            }
            User.updateMany(
                {_id: {$in: dbUserData.friends}},
                {$pull: {friends: [params.id]}}
            )
            .then
            .then(() => {
                Thought.deleteMany({ username: dbUserData.username})
                .then(() => {
                    res.json({message: 'User deleted!'});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.json(400).json(err));
    },

    // create friend on an existing user by another users id
    addFriend({ params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            { $addToSet: {friends: params.friendId }},
            { new: true, runValidators: true}
        ).then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user with this id was found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },

    // delete existing friend by passing in friend id
    deleteFriend({ params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: { friends: params.friendId }},
            { new: true, runValidators: true}
        ).then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id was found!'});
                return;
        }
        User.findOneAndUpdate(
            {_id: params.friendId},
            {$pull: { friends: params.userId}},
            {new: true, runValidators: true}
        )
        .then(dbUserData2 => {
            if(!dbUserData2) {
                res.status(404).json({ message: 'No user with this id was found!'})
                return;
            }
            res.json({message: 'Friend deleted!'});
        })
        .catch(err=> res.json(err));
    })
    .catch(err => res.json(err));
    }
}

module.exports = userController;