import * as React from 'react';
import {Fragment, useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import {
    CarEndpoints,
    getAccessToken,
    GetApi,
    headers,
    headersTextToken,
    PostApi,
} from "../../services/api";
import {createStackNavigator} from '@react-navigation/stack';
import {
    ContainerMid,
    TitleLeft,
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import A2BNextIcon from "../../components/next_icon";
import CarList from "../../components/filterList";
import Loading from "../../components/loading";
import ImageUploadComponent from "./imageUpload";
import {Keyboard, View} from "react-native";
import {IconButton} from "react-native-paper";


const Stack = createStackNavigator();
export default function AddVehicle({ route }) {
   const { mode } = route.params || {};
   console.log(mode)
    const { navigation } = route.params || {};

    console.log('navigation',navigation, 'navigation')
    const { control,handleSubmit ,formState: { errors }  } = useForm();
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [modelsData, setModelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    useEffect(() => {
        if (modelsData.length > 0) {
            navigation.navigate("Model");
        }
    }, [modelsData]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFuel, setSelectedFuel] = useState('');
    const [carData, setCarData] = useState({
        manufact: null,
        model: null,
        color: null,
        carType: null,
        carFul: null,
    });

    const filterData = (data, searchText) => {
        return data.filter((item) =>
            item.Name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when data fetching starts

                const accessToken = await getAccessToken();
                const commonHeaders = {
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                };
                const [manufactData, colorData, carTypeData, carFuelData] = await Promise.all([
                    GetApi(CarEndpoints.get.Manufact, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Color, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Type, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Fuel, { headers: commonHeaders }),
                ]);

                setCarData({
                    manufact: manufactData,
                    color: colorData,
                    carType: carTypeData,
                    carFul: carFuelData,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    async function onSubmit(data) {
        try {
            const ProfileFile = images[0];
            const formData = new FormData();
            const newImages = images.slice(1);
            Keyboard.dismiss();
            setLoading(true);
            formData.append('ManufacturerId', selectedManufacturer);
            formData.append('ModelId', selectedModel);
            formData.append('ColorId', selectedColor);
            formData.append('CarTypeId', selectedType);
            formData.append('PlateNumber', data.PlateNumber);
            formData.append('FuelTypeId', selectedFuel);
            formData.append('ReleaseDate', data.Year);
            formData.append('ProfileFile', { uri: ProfileFile, type: 'image/jpeg', name: 'image.jpg' });
            newImages.forEach((image, index) => {
                formData.append('Files', { uri: image, type: 'image/jpeg', name: `image_${index}.jpg` });
            });

            const accessToken = await getAccessToken();

            if (mode === 'addVehicle') {
                const responseData = await PostApi(CarEndpoints.post.Car, formData, {
                    headers: {
                        ...headers.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else if (mode === 'editVehicle') {
                // Handle edit mode if needed
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);
            navigation.navigate('HomeScreen')
        }
    }

    const getModel = async (id) => {
        console.log(id, 'setSelectedManufacturer');
        const endpoint = CarEndpoints.get.Model + id;
        console.log(endpoint, 'endpoint');

        try {
            setLoading(true); // Set loading to true when data fetching starts

            const accessToken = await getAccessToken();
            const commonHeaders = {
                ...headersTextToken.headers,
                Authorization: `Bearer ${accessToken}`,
            };

            const modelData = await GetApi(endpoint, { headers: commonHeaders });
            setModelData(modelData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Stack.Navigator>
            <Stack.Screen name="Plate" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                        <ContainerMid>
                            <IconButton
                                rippleColor='gray'
                                style={{ position: 'absolute', top: 62, left: 0, zIndex: 3 }}
                                icon='close'
                                iconColor='#7a7a7a'
                                size={28}
                                onPress={() => navigation.goBack()}
                            />
                            <TitleLeft>What's your licence plate number?</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder="XX-000-XX"
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='default'
                                        />
                                        {field.value.length > 0 && (
                                            <A2BNextIcon onPress={() => navigation.navigate('Make')} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="PlateNumber"
                                defaultValue=""
                            />
                        </ContainerMid>
                        )}
                    </>
                )}
            </Stack.Screen>
            <Stack.Screen name="Make" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                            <View style={{flex:1}}>
                                <IconButton
                                    style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                                    icon="arrow-left"
                                    iconColor='#7a7a7a'
                                    size={32}
                                    onPress={() => navigation.navigate('Plate')}
                                />
                            <CarList
                                navigation={navigation}
                                data={carData.manufact}
                                filterFunction={filterData}
                                title={"What's your vehicle's brand?"}
                                placeholder={'Make'}
                                variant={'default'}
                                onSelectItem={(selectedItem) => {
                                    console.log(selectedItem, 'selectedItem');
                                    setSelectedManufacturer(selectedItem);
                                    getModel(selectedItem);
                                }}
                            />
                            </View>
                        )}
                    </>
                )}
            </Stack.Screen>
            <Stack.Screen name="Model" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Make')}
                        />
                        <CarList navigation={navigation} data={modelsData} filterFunction={filterData} title={"What's your vehicle's model?"} placeholder={'Model'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedModel(selectedItem); navigation.navigate("Type");}}
                        />
                    </View>
                    )}
            </Stack.Screen>
            <Stack.Screen name="Type" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Model')}
                        />
                    <CarList navigation={navigation} IconMode='VehicleType' data={carData.carType} filterFunction={filterData} title={"What kind of vehicle it is?"} placeholder={'Type'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedType(selectedItem); navigation.navigate("Color");}}
                    />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Color" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Type')}
                        />
                    <CarList navigation={navigation} IconMode='Color' data={carData.color} filterFunction={filterData} title={"What color is your vehicle?"} placeholder={'Color'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedColor(selectedItem); navigation.navigate("Fuel");}}
                    />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Fuel" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Color')}
                        />
                    <CarList navigation={navigation}  IconMode='FuelType' data={carData.carFul} filterFunction={filterData} title={"What fuel your vehicle uses?"} placeholder={'Fuel'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedFuel(selectedItem); navigation.navigate("Image");}}
                    />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Image" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <Fragment>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 22, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Fuel')}
                        />
                        <ImageUploadComponent setImages={setImages} images={images} />
                        {images.length > 0 && (
                            <A2BNextIcon  onPress={() => navigation.navigate('Year')} />
                        )}
                    </Fragment>

                )}
            </Stack.Screen>
            <Stack.Screen name="Year" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                            <ContainerMid>
                                <IconButton
                                    style={{position:'absolute', left:0 , top: 60, zIndex:10}}
                                    icon="arrow-left"
                                    iconColor='#7a7a7a'
                                    size={32}
                                    onPress={() => navigation.navigate('Image')}
                                />
                                <TitleLeft>When was your vehicle registered?</TitleLeft>
                                <Controller
                                    control={control}
                                    render={({ field }) => (
                                        <React.Fragment>
                                            <A2bInput
                                                placeholder="2013"
                                                value={field.value}
                                                onChangeText={(value) => field.onChange(value)}
                                                variant ='default'
                                            />
                                            {field.value.length > 0 && (
                                                <A2BNextIcon onPress={handleSubmit(onSubmit)} />
                                            )}
                                        </React.Fragment>
                                    )}
                                    name="Year"
                                    defaultValue=""
                                />
                            </ContainerMid>
                        )}
                    </>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

