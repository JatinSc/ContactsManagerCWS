const mongoose = require('mongoose');
const userAuth = require('../middlewares/userAuth');
const { validateContact, Contact } = require('../Models/contactModal');

const router = require('express').Router();


// $ create contact
router.post('/contact', userAuth, async (req, res) => {
    const { error } = validateContact(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const { name, address, email, phone } = req.body

    try {
        const newContact = new Contact({
            name,
            address,
            email,
            phone,
            postedBy: req.user._id,
        });
        const result = await newContact.save();

        return res.status(201)
            .json({ ...result._doc })

    } catch (error) {
        console.log(error)
    }
});

// $ fetch contact.
router.get('/mycontact', userAuth, async (req, res) => {
    try {
        const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        )

        return res.status(200)
        // # we have used reverse() to get the latest contact/element from the array in the first place
            .json({ contacts: myContacts.reverse() });

    } catch (error) {
        console.log(error);
    }
});

//$ update contact
router.put('/contact', userAuth, async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status({ error: 'no id specified' });
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: 'invalid id' });

    try {
        const contact = await Contact.findOne({ _id: id });
        if (req.user._id.toString() !== contact.postedBy._id.toString())
            return res.status(401)
                .json({ error: "you can't edit other's contacts!" })

        //# we don't want to show id in response
        const updatedData = { ...req.body, id: undefined }
        const result = await Contact.findByIdAndUpdate(id, updatedData, { new: true, });
        //#new : true is used to update the data immediately
        return res.status(200).json({ ...result._doc })
    } catch (error) {
        console.log(error)
    }
});

//$ Delete contact
router.delete('/delete/:id', userAuth, async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "no id specified." });

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ error: "please enter a valid id." });

    try {
        const contact = await Contact.findOne({ _id: id });
        if (!contact) return res.status(404).json({ error: "no contact found" })

        if (req.user._id.toString() !== contact.postedBy._id.toString())
            return res
                .status(401)
                .json({ error: "you can't delete other people contacts!" });

        const result = await Contact.deleteOne({ _id: id });
        //# after deleting we will fetch the updated state for contacts
        const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
            "postedBy",
            "-password"
        );
        // # we will pass down updated contact as "myContacts"
        // # after this we will go to frontend /pages/AllContact/delete function and after deleting we will update state with "myContacts"
        return res
            .status(200)
            .json({ ...contact._doc, myContacts: myContacts.reverse() });
            // # we have used reverse() to get the latest contact/element from the array in the first place
        } catch (error) {
    console.log(error);
    }
});

//$ to get a single contact 
// # for editing in frontend
router.get("/contact/:id", userAuth, async (req, res) => {
    const { id } = req.params;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
  
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const contact = await Contact.findOne({ _id: id });
  
      return res.status(200).json({ ...contact._doc });
    } catch (err) {
      console.log(err);
    }
  });
  



module.exports = router;