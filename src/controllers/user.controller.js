import User from "../models/User.js";

export const getProfile=
async(req,res)=>{

res.json({
 success:true,
 data:req.user
});

};

export const updateProfile=
async(req,res)=>{

const user=
await User.findByIdAndUpdate(
 req.user._id,
 req.body,
 {new:true}
);

res.json({
 success:true,
 data:user
});

};
