import {
    ProfileContainer,
    ProfilePic,
    ProfileView,
    ProfileName,
    ProfileTop,
    ProfileAge,
    ProfileTopName,
    ProfileMid,
    ReviewBtn,
    AboutMe,
    ContactBtn,
    ProfileSocialMedia, SurfaceArea, IconView, SurfaceIcon, Agreement,
} from "../../styles/styles";
import {Divider, Icon, IconButton} from "react-native-paper";
import * as React from "react";
import {Linking} from "react-native";
import {useEffect, useState} from "react";
import {accEndpoints, getAccessToken, GetApi, headersTextToken} from "../../services/api";
import DeleteConfirmationModal from "../../components/modal";
import {iconMapping, socialMediaMapping} from "../../styles/vehicleMappings";
import Navigation from "../../components/navigation";
import UserNoIMage from "../../../assets/img/default_user.png";


export default function Profile(props) {
    const [isModalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const deleteButtonPress = () => {
        if (responseData?.UserDetail.Description){
            showModal();
        }
    };

    const profileType = props.route.params.IsUserOrder === 1;
    const userName = props.route.params?.userName;
    const navigation = props.navigation
    const [responseData, setResponseData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (profileType) {
                    const accessToken = await getAccessToken();
                    const responseData = await GetApi(accEndpoints.get.Profile, {
                        headers: {
                            ...headersTextToken.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setResponseData(responseData);
                    console.log(responseData.UserDetail.UserContacts)
                } else {
                    const responseData = await GetApi(`${accEndpoints.get.CommonProfile}?userName=${userName}&`, {
                        headers: {
                            ...headersTextToken.headers,
                        },
                    });
                    setResponseData(responseData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [profileType]);
    const createDate = new Date(responseData?.CreateDate);
    const year = createDate.getFullYear();

    const handlePressPhoneNumber = () => {
        if (!responseData?.IsPhoneNumberVerified) {
            props.navigation.navigate('VerifyPhoneNumber', { phoneNumber: responseData.PhoneNumber , nav:'Home'});
        }
    };
    return (
        <ProfileContainer>
            {responseData && <ProfileView>
                { profileType &&
                <IconButton
                    rippleColor='gray'
                    style={{position:'absolute', top:8, right:0 , zIndex:3}}
                    icon='cog'
                    iconColor='#1B1B1B'
                    size={26}
                    onPress={() =>  props.navigation.navigate('ProfileSettings',{userData:responseData})}
                />}
                <ProfileTop>
                    {  responseData.ProfilePictureUrl !== null &&
                    <ProfilePic
                        source={{ uri: responseData.ProfilePictureUrl } ||  require("../../../assets/img/default_user.png")}
                    />}
                    {  responseData.ProfilePictureUrl == null &&
                        <ProfilePic
                            source={UserNoIMage}
                        />}
                    <ProfileTopName>
                        <ProfileName>
                            {responseData.FirstName} {responseData.LastName}
                        </ProfileName>
                        <ProfileAge>
                            {responseData.Age} Years
                        </ProfileAge>
                        <ProfileAge>
                             Since {year}
                        </ProfileAge>
                        <IconView style={{ flexDirection: 'row' }}>
                            {responseData.UserDetail.UserDescriptionResponseModel.map(contact => (
                                <SurfaceIcon   key={contact.Id} elevation={1}>
                                    <Icon
                                        key={contact.Id}
                                        source={iconMapping[contact.Name]}
                                        color='#7a7a7a'
                                        size={20}
                                    />
                                </SurfaceIcon>
                            ))}
                        </IconView>

                    </ProfileTopName>
                </ProfileTop>
                <ProfileMid>
                    <SurfaceArea  elevation={1}>
                        <ReviewBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text"
                                   onPress={() => { props.navigation.navigate('Reviews', {profileType:profileType, profileName:responseData.FirstName})}}>
                            <Icon
                                source="star"
                                color='#FF5A5F'
                                size={20}
                            />
                            <ProfileAge>  {responseData.StarRatingAmount} ({responseData.UserRatingCount}) Reviews</ProfileAge>
                            <Icon
                                source="chevron-right"
                                color='#1B1B1B'
                                size={20}
                            />
                        </ReviewBtn>
                        <ReviewBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} mode="text">
                            <Icon
                                source="car"
                                color='#FF5A5F'
                                size={18}
                            />
                            <ProfileAge>  {responseData?.PerformedRides || 0} Rides </ProfileAge>
                        </ReviewBtn>
                    </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                    <ReviewBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text"  onPress={deleteButtonPress}>
                        <Icon
                            source="account"
                            color='#FF5A5F'
                            size={24}
                        />
                        <ProfileAge> { profileType? 'About Me':`About ${responseData.FirstName}`} </ProfileAge>
                        <Icon
                            source="chevron-right"
                            color='#1B1B1B'
                            size={24}
                        />
                    </ReviewBtn>
                        <SurfaceArea  elevation={1}>
                    <AboutMe numberOfLines={3} ellipsizeMode="tail">
                  {responseData?.UserDetail.Description || 'Empty'}
                    </AboutMe>
                            <DeleteConfirmationModal
                                isVisible={isModalVisible}
                                onCancel={hideModal}
                            >
                                <Agreement> {responseData?.UserDetail.Description}</Agreement>
                            </DeleteConfirmationModal>
                </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                    <ReviewBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text">
                        <Icon
                            source="information"
                            color='#FF5A5F'
                            size={20}
                        />
                        <ProfileAge>  User info </ProfileAge>
                    </ReviewBtn>
                    <SurfaceArea  elevation={1} style={{paddingBottom:10}}>
                    <ContactBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text" onPress={() => console.log('Pressed')}>
                        <Icon
                            source="email"
                            color='#FF5A5F'
                            size={18}
                        />
                        <AboutMe>  {responseData.Email || (responseData?.IsEmailVerified ? "Verified email":'Email not verified')} </AboutMe>
                        {responseData?.IsEmailVerified ? (
                        <Icon
                            source="check-decagram"
                            color='#1B1B1B'
                            size={18}
                        />
                        ) : null}
                    </ContactBtn>
                    <ContactBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text" onPress={handlePressPhoneNumber}>
                        <Icon
                            source="cellphone"
                            color='#FF5A5F'
                            size={18}
                        />
                        <AboutMe>  {responseData?.PhoneNumber || 'No Phone Number'} </AboutMe>
                        {responseData?.IsPhoneNumberVerified ? (
                            <Icon
                                source="check-decagram"
                                color='#1B1B1B'
                                size={18}
                            />
                        ) : null}
                    </ContactBtn>
                    <ProfileSocialMedia>
                        {responseData.UserDetail.UserContacts.map(contact => (
                            <IconButton
                                style={{marginLeft : 10, marginRight:10}}
                                key={contact.Id}
                                icon={socialMediaMapping[contact.Name]}
                                iconColor='#1B1B1B'
                                size={26}
                                onPress={() => Linking.openURL(contact.ContactData)}
                            />
                        ))}
                    </ProfileSocialMedia>
                    </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                    <SurfaceArea  elevation={1}>
                        <ReviewBtn contentStyle={{ height: 38, marginBottom: 5, justifyContent: 'flex-start'}} rippleColor='gray' mode="text"   onPress={() => {
                            props.navigation.navigate('Vehicles', { carData: responseData.UserCarReponseModels, profileType:profileType, firstName:responseData.FirstName});
                        }}>
                            <Icon
                                source="car-hatchback"
                                color='#FF5A5F'
                                size={20}
                            />
                            <ProfileAge> { profileType? 'My vehicles':`${responseData.FirstName}'s vehicles`}</ProfileAge>
                            <Icon
                                source="chevron-right"
                                color='#1B1B1B'
                                size={20}
                            />
                        </ReviewBtn>
                    </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                </ProfileMid>

            </ProfileView>
            }
            { profileType &&
            <Navigation navigation={navigation} activeButton={'Profile'}/>
            }
        </ProfileContainer>
    );
}
