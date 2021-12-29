const router = require('express').Router();

// thought routes
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controllers');

// get/post use / route
router.route('/').get(getAllThoughts).post(createThought);

// get by id/update/delete use /:id
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

// add/delete reaction use /:thoughtId/reactions
router.route('/:thoughtId/reactions/').post(addReaction).delete(deleteReaction);

module.exports = router;