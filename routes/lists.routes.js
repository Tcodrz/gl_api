"use strict";

const express = require('express');
const ListsController = require('../controllers/list.controller');
const router = express.Router();


router.post('/load', ListsController.GetAllUsersLists);
router.post('/add-list', ListsController.AddList);
router.post('/add-item', ListsController.AddItemToList);
router.post('/delete-item', ListsController.RemoveItemFromList);
router.put('', ListsController.Update);
router.delete('/', ListsController.RemoveItemFromList);

module.exports = router;