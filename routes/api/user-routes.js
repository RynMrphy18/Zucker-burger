const router = require('express').Router();

// routes to create user 

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend, 
    deleteFriend
} = require('../../controllers/user-controllers');

// get/post use /route
router.route('/').get(getAllUsers).post(createUser);

// get by id/update/delete use /:id
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// add/delete friend use /:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;