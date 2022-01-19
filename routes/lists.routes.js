"use strict";

const express = require('express');
const ListController = require('../controllers/list.controller');
const ListsController = require('../controllers/list.controller');
const router = express.Router();


router.post('/load', ListsController.GetAllUsersLists);
router.post('/add-list', ListsController.AddList);
router.post('/list-delete', ListController.DeleteList);
router.post('/add-item', ListsController.AddItemToList);
router.post('/delete-item', ListsController.RemoveItemFromList);
router.post('/mark-items-checked', ListController.MarkItemsCheck);
router.post('/items-uncheck', ListController.UnCheckItems);
router.put('', ListsController.Update);
router.delete('/', ListsController.RemoveItemFromList);

module.exports = router;