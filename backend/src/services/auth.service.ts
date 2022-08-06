import axios from "axios";
import userModel from "models/user.model";
import jwt from 'jsonwebtoken';
import nestedobjectsUtils from "utils/nestedobjects.utils";
import User from "@shared/interfaces/user.interface";
import mongoose from "mongoose";

export async function authUser(code: any) {
    let body = {
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.PUBLIC_URL + "/api/v1/auth/login",
        code: code
      };
    
      try {
        const tokenResponse = await axios.post(
          process.env.VATSIM_AUTH_URL + "/oauth/token",
          body
        );
    
        const userResponse = await axios.get(
          process.env.VATSIM_AUTH_URL + "/api/user",
          {
            headers: {
              Authorization: "Bearer " + tokenResponse.data.access_token,
              Accept: "application/json",
            },
          }
        );
    
        const userFromApi = userResponse.data.data;
    
        console.log(userFromApi);
    
        let user = await userModel.findOne({ "apidata.cid": userFromApi.cid });
    
        const updateOps: User = {
          apidata: userFromApi,
          access_token: tokenResponse.data.access_token,
          refresh_token: tokenResponse?.data?.refresh_token ?? null,
        };
    
        if (userFromApi.oauth.token_valid != "true") {
          // do not save tokens if :wow: they aren't valid
          updateOps.access_token = '';
          updateOps.refresh_token = '';
        }
    
        //create JWT for the Frontend
        let token = jwt.sign(
          {
            cid: userFromApi.cid,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h"
          }
        );
    
        if (user) {
          // user exists, update
          updateOps.vacdm_token = token;
          await userModel.updateOne(
            { _id: user._id },
            { $set: nestedobjectsUtils.getValidUpdateOpsFromNestedObject(updateOps) }
          );
        } else {
          // user does not exist, create in database
          updateOps._id = new mongoose.Types.ObjectId();
          user = new User(updateOps);
          await user.save();
        }
    
        
    
        res.cookie("vacdm_token", token, {
          secure: false,
          httpOnly: false,
        });
      
    

    }
};
  export default {authUser};