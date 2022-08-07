import axios from "axios";
import userModel from "../models/user.model";
import jwt from 'jsonwebtoken';
import nestedobjectsUtils from "../utils/nestedobjects.utils";
import config from '../config';


export async function authUser(code: any) {
    let body = {
        grant_type: "authorization_code",
        client_id: config().clientId,
        client_secret: config().clientSecret,
        redirect_uri: config().publicUrl + "/api/v1/auth/login",
        code: code
      };
    
      try {
        const tokenResponse = await axios.post(
          config().vatsimAuthUrl + "/oauth/token",
          body
        );
    
        const userResponse = await axios.get(
          config().vatsimAuthUrl + "/api/user",
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
    
        const updateOps: any = {
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
          config().jwtSecret,
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
          // updateOps._id = new mongoose.Types.ObjectId();
          user = new userModel(updateOps);
          await user.save();
        }
    
        
    
        return token;
      
    

    } catch (err) {
      throw err;
      
    }
};
  export default {authUser};