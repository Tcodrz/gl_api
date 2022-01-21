"use strict";

const express = require('express');
const ListController = require('../controllers/list.controller');
const ListsController = require('../controllers/list.controller');
const router = express.Router();


router.delete('/', ListsController.RemoveItemFromList);
router.post('/add-item', ListsController.AddItemToList);
router.post('/add-list', ListsController.AddList);
router.post('/delete-item', ListsController.RemoveItemFromList);
router.post('/item-update', ListController.ItemUpdate);
router.post('/items-uncheck', ListController.UnCheckItems);
router.post('/list-delete', ListController.DeleteList);
router.post('/load', ListsController.GetAllUsersLists);
router.post('/mark-items-checked', ListController.MarkItemsCheck);
router.put('', ListsController.Update);

module.exports = router;