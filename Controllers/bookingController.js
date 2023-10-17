const EventModel = require('../Models/eventModel');
const Email = require('../utils/sendGrid');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = async(req,res,next)=>{
    const event = await EventModel.findById(req.params.eventId)
    const user = req.user;
    // console.log("from get checkout session",`${req.protocol}://${req.get('host')}/image/events/${event.photo}`);
    console.log("👻 image url =",`${req.protocol}://${req.get('host')}/image/events/${event.photo}`)
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
                        description:"Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Nunc nec neque.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam,nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Quisque id odio.Aenean vulputate eleifend tellus.",
                        images:[`${req.protocol}://${req.get('host')}/image/events/${event.photo}`]
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
        myevent = await EventModel.findById(eventId)
        await EventModel.findByIdAndUpdate(eventId,{$push:{usersRegistered:userId}}, {
                    runValidators: true,
                    new: true
                });
        res.redirect(`${req.protocol}://${req.get('host')}/`)

        await new Email(req.user,'/','Thank You for booking an event with us.').sendBookingConfirmation(myevent);
        console.log("booking confirmation email sent...")
	} catch (e) {
		console.error(e);
		res.status(400).json({
			status: 'fail',
			error: e.message
		});
	}
}