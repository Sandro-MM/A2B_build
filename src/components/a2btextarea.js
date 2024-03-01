import React from 'react';
import {TextInput} from "react-native-paper";
import { FormTxtArea} from "../styles/styles";


const A2btextarea = ({ placeholder, variant, ...props }) => {
    const [secureTextEntry, setSecureTextEntry] = React.useState(
        variant === 'eye'
    );

    const renderIcon = () => {
        const isEmpty = !props.value || props.value === '';
        const toggleSecureTextEntry = () => {
            setSecureTextEntry((prev) => !prev);
        };

        if (variant === 'default' && !isEmpty) {
            return (
                <TextInput.Icon
                    style={{position:'absolute',top:'-50%',left:'-25%'}}
                    icon="close"
                    onPress={() => {
                        if (props.onChangeText) {
                            props.onChangeText('');
                        }
                    }}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <FormTxtArea
            autoFocus={true}
            maxLength={200}
            multiline={true}
            editable={true}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
            activeOutlineColor="black"
            selectionColor='black'
            cursorColor='black'
            mode="flat"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            {...props}
        />
    );
};

A2btextarea.defaultProps = {
    underlineColorAndroid: 'transparent',
    activeUnderlineColor: 'transparent',
    activeOutlineColor: 'black',
    cursorColor: 'black',
    mode: 'flat',
    value: '',
    onChangeText: () => {},
    variant: 'none',
};

export default A2btextarea;
