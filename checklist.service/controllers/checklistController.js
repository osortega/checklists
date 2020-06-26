const ChecklistModel = require('../models/checklistModel');

module.exports = {
    create: async (req, res) => {
        let checklist = new ChecklistModel({
            title: req.body.title,
            description: req.body.description,
            lastUpdated: new Date(),
            listItems: req.body.listItems
        });

        try {
            const result = await checklist.save();
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to save the checklist.");
        }
    },

    update: async (req, res) => {
        try {
            const checklistInput = { ...req.body, lastUpdated: new Date() }
            const checklist = await ChecklistModel.findOneAndUpdate({ _id: req.params.id }, checklistInput, { new: true });
            if (!checklist) {
                return res.status(404).send("No such checklist exists.");
            }

            return res.json(checklist);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to update the checklist.");
        }
    },

    retrieve: async (req, res) => {
        try {
            const checklist = await ChecklistModel.findById(req.params.id);
            if (!checklist) {
                return res.status(404).send("No such checklist exists.");
            }

            return res.json(checklist);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to fetch the checklist.");
        }
    },

    delete: async (req, res) => {
        try {
            await ChecklistModel.remove({ _id: req.body._id });
            return res.status(204).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to delete the checklist.");
        }
    },

    addItem: async (req, res) => {
        try {
            let checklist = await ChecklistModel.findById(req.params.id);
            if (!checklist) {
                return res.status(404).send("No such checklist exists.");
            }

            checklist.listItems.push(req.body);
            checklist = await checklist.save();
            return res.json(checklist.listItems.slice(-1)[0]);
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to add the checklist item.");
        }
    },

    updateItem: async (req, res) => {
        try {
            const checklistItemInput = { "$set": { "listItems.$": { ...req.body, _id: req.params.itemId } }, lastUpdated: new Date() }
            const checklist = await ChecklistModel.findOneAndUpdate({ _id: req.params.id, "listItems._id": req.params.itemId }, checklistItemInput, { new: true });
            if (!checklist) {
                return res.status(404).send("No such checklist item exists.");
            }

            return res.json(checklist.listItems.id(req.params.itemId));
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to update the checklist item.");
        }
    },

    deleteItem: async (req, res) => {
        try {
            let checklist = await ChecklistModel.findById(req.params.id);
            if (!checklist) {
                return res.status(404).send("No such checklist exists.");
            }

            const item = checklist.listItems.id(req.params.itemId);
            if (item) {
                item.remove();
                checklist = await checklist.save();
            }
            return res.status(204).send();
        } catch (err) {
            console.log(err);
            return res.status(500).send("Failed to delete the checklist item.");
        }
    }
}