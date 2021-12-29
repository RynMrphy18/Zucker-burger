const { User, Thought} = require('../models');

const thoughtController = {

    // find all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err=> {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // find one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought with this id was found!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create new thought using the body
    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                {_id: body.UserId},
                {$push: {thoughts: dbThoughtData._id}},
                {new: true}
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with this id was found!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },
    
    // find existing thought and updatr its body
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.id}, body, { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought with this id was found!'});
            return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // find existing thought and delete
    deleteThought( {params}, res) {
        Thought.findOneAndDelete({_id: params.id})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this id was found!'});
                return;
            }
            User.findOneAndUpdate(
                { username: dbThoughtData.username},
                { $pull: { thoughts: params.id }}
            )
            .then(() => {
                res.json({ message: 'Thought deleted!'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    // find existing thought and add reaction to it by passing in body text and username
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            { $addToSet: {reactions: body }},
            { new: true, runValidators: true}
        ).then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought with this id was found!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    // find existing reaction and delete it
    deleteReaction({ params, body}, res) {
        console.log(body);
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: { reactions: { reactionId: body.reactionId }}},
            { new: true, runValidators: true}
        ).then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with this id was found!'});
                return;
            }
            res.json({message: 'Reaction deleted!'});
        })
        .catch(err => res.status(500).json(err));
    }
}

module.exports = thoughtController;