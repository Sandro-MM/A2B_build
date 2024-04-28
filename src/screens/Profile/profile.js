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
    ProfileSocialMedia, SurfaceArea, IconView, Agreement, SmallRedBtn,
} from "../../styles/styles";
import {Divider, Icon, IconButton, Surface} from "react-native-paper";
import * as React from "react";
import {AppState, Image, Linking, ScrollView, Text, TouchableHighlight, View} from "react-native";
import {useEffect, useState} from "react";
import {accEndpoints, getAccessToken, GetApi, headersTextToken} from "../../services/api";
import DeleteConfirmationModal from "../../components/modal";
import {iconMapping, socialMediaMapping} from "../../styles/vehicleMappings";
import Navigation from "../../components/navigation";
import UserNoIMage from "../../../assets/img/default_user.png";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import BG from "../../../assets/img/hills.png";
import CAR from "../../../assets/img/profile_car.png";
import SETTING from "../../../assets/img/settings.png";
import PERSON from "../../../assets/img/profile_person.png";
import STAR from "../../../assets/img/star.png";
import PROFILE_TKT from "../../../assets/img/profile_bg.png";
import ABOUT_ME from "../../../assets/img/about.png";
import INFO from "../../../assets/img/info.png";
import VERIFY from "../../../assets/img/Verifiedtick.png";
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts} from "@expo-google-fonts/inter";

export default function Profile(props) {
    const { t } = useTranslation();
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });

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

    const [selectedTab, setSelectedTab] = useState('about_me');

    const renderContent = () => {
        switch (selectedTab) {
            case 'about_me':
                return  <View style={{paddingTop:10}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{width:51, height:51}} source={ABOUT_ME}/>
                                <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{ profileType? t('about_me'):`${t('about')} ${responseData.FirstName}`}</Text>
                            </View>

                            <Text style={{marginTop:20, color:'#475467', fontSize:16, fontFamily:'Inter_400Regular'}}>
                                {responseData?.UserDetail.Description || t('empty')}
                            </Text>
                        </View>
            case 'info':
                return <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:51, height:51}} source={INFO}/>
                        <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{t('info')}</Text>
                    </View>

                    <View style={{marginTop:20, flexDirection:'row' , alignItems:'center', marginLeft:-8}}>
                        <View style={{width:35}}>
                        {responseData?.IsEmailVerified ? (
                            <IconButton
                                style={{marginHorizontal:0}}
                                iconColor={null}
                                size={22}
                                icon={VERIFY}/>
                        ) : null}
                        </View>
                        <Text style={{color: '#667085', fontSize:16, fontFamily:'Inter_600SemiBold'}}>
                            {responseData.Email || (responseData?.IsEmailVerified ? t("verified_email"):t('email_not_verified'))}
                        </Text>
                    </View>
                    <View style={{marginTop:0, flexDirection:'row' , alignItems:'center', marginLeft:-8}}>
                        <View style={{width:36}}>
                            {responseData?.IsPhoneNumberVerified ? (
                                <IconButton
                                    style={{marginHorizontal:0}}
                                    iconColor={null}
                                    size={22}
                                    icon={VERIFY}/>
                            ) : null}
                        </View>


                        <Text style={{color: '#667085', fontSize:16, fontFamily:'Inter_600SemiBold'}}>
                            {responseData?.PhoneNumber || t('no_phone_number')}
                        </Text>
                        {
                            !profileType && <SmallRedBtn   style={{marginTop:-3, marginLeft:-8}} mode="text" onPress={handlePressPhoneNumber}>
                                <Text style={{color:'#FF5A5F', fontSize:16, fontFamily:'Inter_400Regular'}}>{t('reveal_number')}</Text>
                            </SmallRedBtn>
                        }
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{color: '#667085', fontSize:14, fontFamily:'Inter_500Medium'}}>
                            { t("socials")}
                        </Text>
                        <ProfileSocialMedia style={{marginLeft:-4}}>
                            {responseData.UserDetail.UserContacts.map(contact => (
                                <IconButton
                                    style={{width:24}}
                                    key={contact.Id}
                                    icon={socialMediaMapping[contact.Name]}
                                    iconColor={null}
                                    size={26}
                                    onPress={() => Linking.openURL(contact.ContactData)}
                                />
                            ))}
                        </ProfileSocialMedia>
                    </View>
                </View>
            case 'cars':
                return <Text>Cars Content</Text>;
            case 'reviews':
                return <Text>Reviews Content</Text>;
            default:
                return null;
        }
    };

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };


    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                fetchData();
            }
        };
        const focusListener = navigation.addListener('focus', fetchData);
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
        fetchData();
        return () => {
            if (focusListener && typeof focusListener.remove === 'function') {
                focusListener.remove();
            }
            if (appStateSubscription) {
                appStateSubscription.remove();
            }
        };
    }, [navigation, profileType]);


    const fetchData = async () => {
        const language = await SecureStore.getItemAsync('userLanguage');
        try {
            if (!userName) {
                const accessToken = await getAccessToken();
                const responseData = await GetApi(accEndpoints.get.Profile, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setResponseData(responseData);
                console.log(responseData.UserDetail.UserContacts)
            } else {
                const responseData = await GetApi(`${accEndpoints.get.CommonProfile}?userName=${userName}&`, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                    },
                });
                setResponseData(responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const createDate = new Date(responseData?.CreateDate);
    const year = createDate.getFullYear();

    const handlePressPhoneNumber = () => {
        if (!responseData?.IsPhoneNumberVerified) {
            props.navigation.navigate('VerifyPhoneNumber', { phoneNumber: responseData.PhoneNumber , nav:'Home'});
        }
    };
  if (fontsLoaded)  return (
        <ProfileContainer>
            {responseData && <ProfileView>
                <ScrollView>
                { profileType &&
                <IconButton
                    rippleColor='gray'
                    style={{position:'absolute', top:132, right:0 , zIndex:3}}
                    icon={SETTING}
                    iconColor={null}
                    size={36}
                    onPress={() =>  props.navigation.navigate('SettingsPage',{userData:responseData, setUserData:setResponseData})}
                />}

                <Image style={{height:120, width:'100%'}} source={BG}/>

                <View style={{width:'100%', justifyContent:'center', alignItems:'center', position:'absolute', top:70}}>
                    <Surface style={{width:104, height:104, backgroundColor:"#fff", borderRadius:100, justifyContent:'center', alignItems:'center'}}>
                        {  responseData.ProfilePictureUrl !== null &&
                            <ProfilePic
                                source={{ uri: responseData.ProfilePictureUrl } ||  require("../../../assets/img/default_user.png")}
                            />}
                        {  responseData.ProfilePictureUrl == null &&
                            <ProfilePic
                                source={UserNoIMage}
                            />}
                    </Surface>
                    <ProfileName style={{fontFamily:'Inter_700Bold'}}>
                        {responseData.FirstName} {responseData.LastName}
                    </ProfileName>
                    <View style={{paddingHorizontal:16, marginVertical:24, gap:16, flexDirection:'row'}}>
                        <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                            <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={PERSON}/>
                            <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                                {t('since')}
                            </Text>
                            <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>
                                {year}
                            </Text>
                        </View>
                        <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                            <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={CAR}/>
                            <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                                {t('rides')}
                            </Text>
                            <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>
                                {responseData?.PerformedRides || 0}
                            </Text>
                        </View>
                        <View style={{height:114,backgroundColor: '#F2F4F7', width:'32%', maxWidth:104, paddingHorizontal:8, paddingVertical:12, borderRadius:16,  alignItems:'center',}}>
                        <Image style={{width:24, height:24, resizeMode:'contain', marginTop:12}} source={STAR}/>
                        <Text style={{fontSize:12, marginTop:12, fontFamily:'Inter_500Medium', color: '#475467'}}>
                            {t('reviews')}
                        </Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#101828', fontSize:20, fontFamily:'Inter_700Bold'}}>{responseData.StarRatingAmount}</Text>
                                <Text style={{fontSize:12, fontFamily:'Inter_400Regular', color: '#667085', marginTop:6}}> ({responseData.UserRatingCount})</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{paddingHorizontal:16, width:'100%', alignItems:'center', height:70}}>
                        <IconView style={{ flexDirection: 'row', alignItems:'center'}}>
                            <Text style={{position:'absolute', fontSize:12, fontFamily:'Inter_500Medium', color: '#475467', top:12, left:16}}>{t('my_preferences')}</Text>
                            {responseData.UserDetail.UserDescriptionResponseModel.map(contact => (
                                <View style={{marginTop:26}}   key={contact.Id}>
                                    <Icon
                                        key={contact.Id}
                                        source={iconMapping[contact.Name]}
                                        color='#7a7a7a'
                                        size={18}
                                    />
                                </View>
                            ))}
                        </IconView>
                    </View>

                    <View style={{ width:'100%', paddingHorizontal:16, paddingTop:48 }}>
                        <View style={{flexDirection:'row', height:48, width:'100%', backgroundColor:'#FFF', borderStyle:'solid', borderColor:'#EAECF0', borderWidth:1, paddingHorizontal:16, paddingTop:16, gap:16}}>
                            <TouchableHighlight
                                style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'about_me' ? 2 : 0}}
                                onPress={() => handleTabPress('about_me')}
                                underlayColor='rgba(128, 128, 128, 0.5)'
                            >
                                <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'about_me' ? '#FF5A5F' : '#667085'}}>
                                    { profileType? t('about_me'):`${t('about')}`}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'info' ? 2 : 0}}
                                onPress={() => handleTabPress('info')}
                                underlayColor='rgba(128, 128, 128, 0.5)'
                            >
                                <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'info' ? '#FF5A5F' : '#667085'}}>
                                    {t('info')}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'cars' ? 2 : 0}}
                                onPress={() => handleTabPress('cars')}
                                underlayColor='rgba(128, 128, 128, 0.5)'
                            >
                                <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'cars' ? '#FF5A5F' : '#667085'}}>
                                    {t('cars')}
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{paddingHorizontal:4, borderStyle:'solid', borderColor:'#FF5A5F', borderBottomWidth:selectedTab === 'reviews' ? 2 : 0}}
                                onPress={() => handleTabPress('reviews')}
                                underlayColor='rgba(128, 128, 128, 0.5)'
                            >
                                <Text style={{fontFamily:'Inter_600SemiBold', color:selectedTab === 'reviews' ? '#FF5A5F' : '#667085'}}>
                                    {t('reviews')}
                                </Text>
                            </TouchableHighlight>
                        </View>
                        <Image style={{ height:44, resizeMode:'contain', width:'109.4%', marginLeft:-15}} source={PROFILE_TKT}/>
                        <View                          style={{backgroundColor: '#fff', borderStyle:'solid', borderColor:'#EAECF0', borderBottomWidth:1, borderLeftWidth:1, borderRightWidth:1, width:'100.1%', marginTop:-1, paddingHorizontal:16, borderBottomLeftRadius:20, borderBottomRightRadius:20, paddingBottom:16, marginBottom:60}}>
                            {renderContent()}
                        </View>

                    </View>

                </View>










                <ProfileTop style={{marginTop:1200}}>

                    <ProfileTopName>

                        <ProfileAge>
                            {responseData.Age} {t('years')}
                        </ProfileAge>



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
                            <ProfileAge>  {responseData.StarRatingAmount} ({responseData.UserRatingCount}) {t('reviews')}</ProfileAge>
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
                            <ProfileAge>  {responseData?.PerformedRides || 0}  {t('rides')} </ProfileAge>
                        </ReviewBtn>
                    </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                    <ReviewBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text"  onPress={deleteButtonPress}>
                        <Icon
                            source="account"
                            color='#FF5A5F'
                            size={24}
                        />
                        <ProfileAge> { profileType? t('about_me'):`${t('about')} ${responseData.FirstName}`} </ProfileAge>
                        <Icon
                            source="chevron-right"
                            color='#1B1B1B'
                            size={24}
                        />
                    </ReviewBtn>
                        <SurfaceArea  elevation={1}>
                    <AboutMe numberOfLines={3} ellipsizeMode="tail">
                  {responseData?.UserDetail.Description || t('empty')}
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
                        <ProfileAge>  {t('user_info')} </ProfileAge>
                    </ReviewBtn>
                    <SurfaceArea  elevation={1} style={{paddingBottom:10}}>
                    <ContactBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text" onPress={() => console.log('Pressed')}>
                        <Icon
                            source="email"a
                            color='#FF5A5F'
                            size={18}
                        />
                        {responseData?.IsEmailVerified ? (
                            <Icon
                                source="check-decagram"
                                color='#1B1B1B'
                                size={18}
                            />
                        ) : null}
                        <AboutMe>  {responseData.Email || (responseData?.IsEmailVerified ? t("verified_email"):t('email_not_verified'))} </AboutMe>

                    </ContactBtn>
                    <ContactBtn contentStyle={{ height: 38, justifyContent: 'flex-start'}} rippleColor='gray' mode="text" onPress={handlePressPhoneNumber}>
                        <Icon
                            source="cellphone"
                            color='#FF5A5F'
                            size={18}
                        />
                        <AboutMe>  {responseData?.PhoneNumber || t('no_phone_number')} </AboutMe>
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
                            props.navigation.navigate('Vehicles', { carData: responseData.UserCarReponseModels, profileType:profileType, firstName:responseData.FirstName, navigation:navigation});
                        }}>
                            <Icon
                                source="car-hatchback"
                                color='#FF5A5F'
                                size={20}
                            />
                            <ProfileAge> { t(profileType? 'my_vehicles':null)} {!profileType? responseData.FirstName: null } {t(!profileType? 'user_s_vehicles': null )}</ProfileAge>
                            <Icon
                                source="chevron-right"
                                color='#1B1B1B'
                                size={20}
                            />
                        </ReviewBtn>
                    </SurfaceArea>
                    <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                </ProfileMid>
                </ScrollView>
            </ProfileView>
            }
            { profileType &&
            <Navigation navigation={navigation} activeButton={'Profile'}/>
            }

        </ProfileContainer>
    );
}
