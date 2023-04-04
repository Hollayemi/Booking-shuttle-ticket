const NewPickup = require("../models/pick_ups");
const { validatePickup } = require("../models/validation");

exports.addNewPickup = async(req, res) => {
    const { error } = validatePickup(req.body);
    const randNum = Math.floor(Math.random() * 89999 + 10000).toString()
    // let minute = parseInt(req.body.time.split(':')[1]);
    const exists = await NewPickup.findOne({time: req.body.time, pick_loaction: req.body.pick_loaction})
    try {
        if(!error){
            if(!exists) {
                const saveInfo = await NewPickup({...req.body, ride_code: randNum});
                saveInfo && saveInfo.save()
                return res.status(201).json({ data: saveInfo, message: 'We will notify the driver', status: "success"})
            }else{
                return res.status(501).json({message: 'You already set pick-up with this time and destination', status: "error"})
            }
        }else{
            return res.status(501).json({message:error.details[0].message, type:"error"})
        }
    } catch (error) {
        return res.status(500).json({message: 'unable to update node', status: "error"})
    }
}


// pickup functions

exports.getPickups = async(req, res) => {
    try {
        const myPickups = await NewPickup.find({ pickedBy: "waiting"  });
        return res.status(200).json({data: myPickups, status: "success"})
    } catch (error) {
        return res.status(500).json({message: 'unable to fetch data', status: "error"})
    }
}

exports.updatePickup = async(id, car_no) => {
    await NewPickup.findOneAndUpdate({_id: id},{
            $set: {pickedBy: car_no}
        },
        {new:true}
    );
    return true
}

// update sensor node
exports.confirmPickup = async(req, res) => {
    console.log(req.body)
    try {
        const saveInfo = await NewPickup.findById(req.body.id);
        const info = saveInfo.ride_code === req.body.code ? 'correct' : 'incorrect'
        info === 'correct' && this.updatePickup(req.body.id, req.body.car_no)
        return res.status(200).json({ message: info, status: "success"})
    } catch (error) {
        return res.status(500).json({message: 'unable to delete node', status: "error"})
    }
}