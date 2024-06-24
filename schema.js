const joi=require("joi");
module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        price:joi.number().required().min(0),
        country:joi.string().required(),
        // image:joi.string().allow("",null)
    })
})