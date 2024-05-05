import {
    ProfileContainer,
    ProfilePic,
    ProfileView,
    ProfileName,
    ProfileSocialMedia,
    IconView,
    SmallRedBtn,
    ListPic,
    VehicleFuel, SurfaceArea, ReviewBtn, ProfileAge,
} from "../../styles/styles";
import {Icon, IconButton, Surface} from "react-native-paper";
import * as React from "react";
import {AppState, Image, Linking, ScrollView, Text, TouchableHighlight, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {accEndpoints, getAccessToken, GetApi, headersTextToken} from "../../services/api";
import {
    fuelTypeMapping,
    iconMapping,
    socialMediaMapping,
    vehicleTypeMapping
} from "../../styles/vehicleMappings";
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
import REVIEW from "../../../assets/img/review.png";
import CAR2 from "../../../assets/img/CarProfile.png";
import GAS from "../../../assets/img/Gas.png";
import {Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts} from "@expo-google-fonts/inter";
import {useNavigation, useRoute} from "@react-navigation/native";
import {debounce} from "lodash";

export default function Profile() {
    const { t } = useTranslation();
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });

    const navigation = useNavigation();
    const route = useRoute();
    const profileType = route.params.IsUserOrder === 1;
    const userName = route.params?.userName;

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
                            profileType && <SmallRedBtn   style={{marginTop:-3, marginLeft:-8}} mode="text" onPress={handlePressPhoneNumber}>
                                <Text style={{color:'#FF5A5F', fontSize:16, fontFamily:'Inter_400Regular'}}>{t('verify_number')}</Text>
                            </SmallRedBtn>
                        }
                        {
                            (!profileType && responseData?.PhoneNumber) && <SmallRedBtn   style={{marginTop:-3, marginLeft:-8}} mode="text" onPress={()=>console.log(1)}>
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
                return <View style={{paddingTop:10}}>
                    {
                        responseData?.UserCarReponseModels.length > 0 &&
                            responseData?.UserCarReponseModels.map((item, index)=>(
                            <View key={index} style={{marginVertical:12, width:'100%', height:337, borderRadius:16, borderColor:'#D0D5DD', borderStyle:'solid', borderWidth:1, borderBottomWidth:3}}>
                                <Image
                                    style={{width:'100%', height: 180, borderTopRightRadius:16, borderTopLeftRadius:16}}
                                    source={{
                                        uri: item.CarPictureUrls[0]?.Name,
                                    }}
                                />
                                <View style={{marginTop:20, marginHorizontal:16}}>
                                    <Text style={{color:'#344054', fontFamily:'Inter_600SemiBold'}}> {item.Manufacturer.Name} {item.Model?.Name}
                                    </Text>
                                    <Text style={{color:'#344054', fontFamily:'Inter_600SemiBold'}}> {item.ReleaseDate}</Text>
                                    <Text style={{color:'#667085', fontFamily:'Inter_400Regular'}}> {item.Color?.Name} </Text>
                                    <Text style={{color: '#101828', fontFamily:'Inter_700Bold', fontSize:24, position:'absolute', top:0, right:0}}>{item.PlateNumber}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <VehicleFuel
                                            contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                            mode="text"
                                        >
                                            <Icon
                                                source={GAS}
                                                color="#343330"
                                                size={20}
                                            />
                                            <Text style={{color:'#475467',  fontSize:16, fontFamily:'Inter_400Regular'}}> {item.FuelType?.Name} </Text>
                                        </VehicleFuel>
                                        <VehicleFuel
                                            contentStyle={{ height: 38, justifyContent: 'flex-start' }}
                                            mode="text"
                                        >
                                            <Icon
                                                source={CAR2}
                                                color="#343330"
                                                size={20}
                                            />
                                            <Text style={{color:'#475467',  fontSize:16, fontFamily:'Inter_400Regular'}}>  {item.CarType?.Name} </Text>
                                        </VehicleFuel>
                                    </View>
                                </View>
                            </View>
                        ))}


                </View>
            case 'reviews':
                return <View style={{paddingTop:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={{width:51, height:51}} source={REVIEW}/>
                        <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_500Medium', marginLeft:14, marginTop:8}}>{t('reviews')}</Text>
                        <View style={{flexDirection:'row', alignItems:'center', position:'absolute', right:0, top:16}}>
                            <Image style={{width:24, height:24, resizeMode:'contain'}} source={STAR}/>
                            <Text style={{color:'#101828', fontSize:18, fontFamily:'Inter_700Bold'}}>{responseData.StarRatingAmount}</Text>
                            <Text style={{color:'#667085', fontSize:12, fontFamily:'Inter_400Regular'}}> ({responseData.UserRatingCount})</Text>
                        </View>

                    </View>

                    {
                        responseData?.UserRatingResponseModels.map((item, index)=>(
                            <View key={index} style={{marginTop:24}}>
                                <View style={{width:'100%', height:1, backgroundColor:'#EAECF0', marginBottom: 24}}/>
                                <ListPic
                                    source={UserNoIMage}
                                />
                                <View style={{flexDirection:'row', position:'absolute', top:25, left:56}}>
                                    {Array.from({ length: item.StarCount }).map((_, starIndex) => (
                                        <Image
                                            key={starIndex}
                                            style={{ width: 24, height: 24, resizeMode: 'contain' }}
                                            source={STAR}
                                        />
                                    ))}
                                </View>
                                <Text style={{marginTop:24, color:'#344054',fontSize:16, fontFamily:'Inter_400Regular'}}>{item.Review}</Text>
                            </View>
                        ))}
                </View>
            default:
                return null;
        }
    };



    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };


    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active' && navigation.isFocused()) {
                debouncedFetchData();
            }
        };

        const focusListener = navigation.addListener('focus', debouncedFetchData);
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            focusListener();
            appStateSubscription.remove();
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData, navigation]);


    const fetchData = useCallback(async () => {
        const language = await SecureStore.getItemAsync('userLanguage');
        try {
            let responseData;
            if (profileType) {
                const accessToken = await getAccessToken();
                responseData = await GetApi(accEndpoints.get.Profile, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else {
                responseData = await GetApi(`${accEndpoints.get.CommonProfile}?userName=${userName}&`, {
                    headers: {
                        'Accept-Language': language,
                        ...headersTextToken.headers,
                    },
                });
            }
            setResponseData(responseData);
            console.log(responseData?.UserDetail?.UserContacts); // Conditional chaining for safer access
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [profileType, userName]);

    const debouncedFetchData = useCallback(debounce(fetchData, 1000), [fetchData]);




    const createDate = new Date(responseData?.CreateDate);
    const year = createDate.getFullYear();

    const handlePressPhoneNumber = () => {
        if (!responseData?.IsPhoneNumberVerified) {
            navigation.navigate('VerifyPhoneNumber', { phoneNumber: responseData.PhoneNumber , nav:'Home'});
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
                    onPress={() =>  navigation.navigate('SettingsPage',{userData:responseData, setUserData:setResponseData})}
                />}

                <Image style={{height:120, width:'100%'}} source={BG}/>

                <View style={{width:'100%', justifyContent:'center', alignItems:'center', marginTop:-50, marginBottom:50}}>
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
                        <View style={{backgroundColor: '#fff', borderStyle:'solid', borderColor:'#EAECF0', borderBottomWidth:1, borderLeftWidth:1, borderRightWidth:1, width:'100.1%', marginTop:-1, paddingHorizontal:16, borderBottomLeftRadius:20, borderBottomRightRadius:20, paddingBottom:16, marginBottom:60}}>
                            {renderContent()}
                        </View>
                    </View>
                </View>

                </ScrollView>
            </ProfileView>
            }
            { profileType &&
            <Navigation navigation={navigation} activeButton={'Profile'}/>
            }

        </ProfileContainer>
    );
}
