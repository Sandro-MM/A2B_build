import axios from 'axios';
import * as SecureStore from "expo-secure-store";

const BASE_URL = 'https://api-a2b.azurewebsites.net/api/v1'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
});
export async function getAccessToken() {
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const expirationTime = await SecureStore.getItemAsync('accessTokenExpiration');
        const data = {
            AccessToken: accessToken,
            RefreshToken: refreshToken
        }
        if (accessToken && Date.now() < parseInt(expirationTime)) {
            return accessToken;
        } else {
            const newAccessToken = await PostApi(accEndpoints.post.Refresh, data);
            console.log('refreshed Token')
            if (newAccessToken) {
                const newExpirationTime = Date.now() + 30 * 60 * 1000;
                await SecureStore.setItemAsync('accessToken', newAccessToken.AccessToken);
                await SecureStore.setItemAsync('accessTokenExpiration', newExpirationTime.toString());
                await SecureStore.setItemAsync('refreshToken', newAccessToken.RefreshToken);
                return newAccessToken.AccessToken;
            }
            return null;
        }
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
}

export const headers = {headers :{'accept': 'text/plain',
  'Content-Type': 'multipart/form-data'}};
export const headersText = {headers :{'accept': 'text/plain',
        'Content-Type': 'application/json'}};
export const headersTextToken = {headers :{'accept': 'text/plain',
        'Content-Type': 'application/json'}};
export const accEndpoints = {
    get:{
        Profile: '/account/profile',
        CommonProfile:'/account/commonprofile',
        ComProfPhoneNum:'/account/profile-phonenumber',
        UserReview:'/account/user-reviews',
        UserSendReview:'/account/user-send-reviews',
        ChangeLang:'/account/change-language/?language=',
        ActiveRidesNumber:'/account/ride-number',
        IsUserVerified:'/account/user-verification',
        NotificationStatus:'/usersettings/notification'
    },
    post:{
        Register: '/account/register',
        IsUserEmail:'/account/change-password',
        EmailVerifyPassReset:'/account/change-password',
        Login:'/account/login',
        Logout:'/account/logout',
        Refresh:'/account/refresh',
        CheckEmailExists:'/account/profile-email',
        RegEmailForReg:'/account/user-send-reviews',
        ActivateEmailForReg:'/account/activate-email',
        LoginWithFB:'/account/change-language',
        AddPhone:'/account/add-phone-number',
        VerifyPhone:'/account/verify-phone-number',
        CheckEmailForPassReset:'/account/is-user-email',
        VerifyEmailPassReset:'/account/verify-email'

    },
    put:{
        EditProfile:'/account/edit-profile-mobile',
        ChangePassword:'/account/change-password',

    },
    patch:{
        ResetPass:'/account/reset-password',
        IsRegEmail:'/account/is-registered-email',
        ValidateEmail:'/account/validate-email',
        ConfirmEmail:'/account/confirm-email',
        ConfirmPhone:'/account/confirm-phone-number',
        EditImage:'/file/change-user-profile-file'
    },
    delete:{
        UserDel:'/account/user-deactivation'
    }
};
export const CarEndpoints = {
    get:{
        Cars: '/car',
        Car: `/car/`,
        Manufact:'/car/manufacturer-dropdown',
        Model:'/car/model-dropdown?id=',
        Plate:'/car-platenumber',
        Color:'/car/color-dropdown',
        Type:'/cardetails/cartype-dropdown',
        Fuel:'/cardetails/fueltype-dropdown'
    },
    post:{
        Car: '/car',
    },
    put:{
        Car: `/car/`

    },
    delete:{
        Car: `/car/`
    }
};
export const OrderEndpoints = {
    get:{
        maxPrice:'/order/orders_maxprice',
        orders:'/order/orders',
        order:'/order/orders-by-id',
        userOrders:'/order/user-orders',
        startOrder:'/order/start-order?orderId=',
        getPassengerRequests:'/order/order-passangers?orderId='
    },
    post:{
        createOrder:'/order/create-order',
        order:'/order/'
    },
    put:{


    },
    patch:{
        bind:'/order/bind',
    },
    delete:{
        cancelOrder:'/order/',
    }
};


export async function PostApi(urlRoute, data, optParam) {
    const route = BASE_URL + urlRoute;
    console.log(data);
    console.log(route);
    try {
        const response = await axios.post(route, data, optParam);
        return response.data;
    } catch (error) {
        console.log(error)
        throw  error;
    }
}

export async function PutApi(urlRoute, data, optParam) {
    const route = BASE_URL + urlRoute;
    console.log(data);
    console.log(route);
    try {
        const response = await axios.put(route, data, optParam);
        return response.data;
    } catch (error) {
        console.log(error)
        throw  error;
    }
}

export async function PatchApi(urlRoute, data, optParam) {
    const route = BASE_URL + urlRoute;
    console.log(data);
    console.log(route);
    try {
        const response = await axios.patch(route, data, optParam);
        return response.data;
    } catch (error) {
        console.log(error)
        throw  error;
    }
}
export async function GetApi(url, headers) {
    const route = BASE_URL + url;
    console.log(route);
    try {
        const response = await axios.get(route, headers);
        console.log(response.data,'response.data,');
        return response.data;
    } catch (error) {
        console.error(error);
        throw  error;
    }

}
export async function DelApi(url, headers, id) {
    const route = BASE_URL + url + id;
    console.log(route);
    try {
        const response = await axios.delete(route, headers);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw  error;
    }

}
