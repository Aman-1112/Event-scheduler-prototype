const EventModel = require('../Models/eventModel');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async(req,res,next)=>{
    const event = await EventModel.findById(req.params.eventId)
    const user = req.user;
    // console.log("from get checkout session",`${req.protocol}://${req.get('host')}/image/events/${event.photo}`);

    //checkout session contains detail of what customer will see at time of checkout
    const response = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?eventId=${event._id}&userId=${user._id}`,
        cancel_url:`${req.protocol}://${req.get('host')}/`,
        mode:'payment',
        customer_email:req.user.email,
        client_reference_id:req.params.eventId,
        line_items:[
            {   
            quantity:1,
            price_data:{
                unit_amount:event.entryFee*100+50,
                product_data:{
                    name:event.title,
                    description:'Good Event',
                    images:[`http://localhost:5000/image/events/${event.photo}`]
                },
                currency:'inr'
            }
        }
        ]
    })

    res.status(200).json({
        status:"success",
        response
    })
    
}


exports.createBooking=async(req,res,next)=>{
	try {
        let {eventId,userId} = req.query;
        
        if(!eventId || !userId){ 
            return next();
        }
        
        await EventModel.findByIdAndUpdate(eventId,{$push:{usersRegistered:userId}}, {
                    runValidators: true,
                    new: true
                });
        res.redirect(`${req.protocol}://${req.get('host')}/`)

	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
}