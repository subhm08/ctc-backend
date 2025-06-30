const express = require('express')
const router = express.Router();

const Enquiry = require('../schema/enquirySchema')

module.exports = (io) =>{
    router.post('/', async (req, res) =>{
        try{
            const data = await Enquiry.create(req.body);
            io.emit('newEnquiry', data);
            res.status(201).json({message: 'Enquiry created successfully'});
        }catch(err){
            res.status(500).json({message: 'Error creating enquiry'});
        }
    })

    router.get('/', async (req, res) => {
        const allEnquiry = await Enquiry.find().sort({createdAt: -1})
        res.json(allEnquiry)
    })

    router.patch('/:id', async (req, res) => {
        const updatedStatus = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStatus);
    });

    return router;


}
