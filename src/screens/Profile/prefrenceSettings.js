import React from 'react';
import {SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {Text, View} from "react-native";
import {Checkbox, IconButton} from "react-native-paper";
import {OrderIconColorMapping, OrderIconMapping} from "../../styles/vehicleMappings";


const PrefrenceSettings = () => {

    const [pets, setPets] = React.useState(false);
    const [music, setMusic] = React.useState(false);
    const [luggage, setLuggage] = React.useState(false);
    const [smoke, setSmoke] = React.useState(false);
    const [packageItem, setPackageItem] = React.useState(false);

    return (
       <View style={{ width:'100%', height:'100%',  alignItems:'center'}}>
           <Title>Change prefrence</Title>
           <View style={{justifyContent:'flex-start', width:'50%'}} >
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={smoke ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setSmoke(!smoke);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[1]}
                   size={20}
                   icon={OrderIconMapping[1]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}> Smoker</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={music ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setMusic(!music);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[7]}
                   size={20}
                   icon={OrderIconMapping[7]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}> Music</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={pets ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setPets(!pets);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[4]}
                   size={20}
                   icon={OrderIconMapping[4]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}> Pets</Text>

           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={luggage ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setLuggage(!luggage);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[9]}
                   size={20}
                   icon={OrderIconMapping[9]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}> Travel</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center', width:250}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={packageItem ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setPackageItem(!packageItem);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[9]}
                   size={20}
                   icon={'chat-outline'}
               />
               <Text style={{fontSize:16, marginLeft:-5}}>Chatter</Text>
           </View>
               </View>
           <SmallRedBtn style={{position:'absolute', bottom:50}} buttonColor='#FF5A5F' mode='contained' onPress={()=>console.log(1)}>
               <SmallBtnText>Save</SmallBtnText>
           </SmallRedBtn>
       </View>
    );
};
export default PrefrenceSettings

