import React from 'react';
import {TextInput} from "react-native-paper";
import { FormInput } from "../styles/styles";


const A2bInput = ({ placeholder, variant, ...props }) => {
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
    } else if (variant === 'eye' && !isEmpty) {
        return (
            <TextInput.Icon
                style={{position:'absolute',top:'-50%',left:'-25%'}}
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={toggleSecureTextEntry}
            />
        );
    } else {
        return null;
    }
};

    return (
        <FormInput
            underlineColor='transparent'
            activeUnderlineColor='transparent'
            activeOutlineColor="black"
            selectionColor='black'
            cursorColor='black'
            mode="flat"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            right={renderIcon()}
            {...props}
        />
    );
};

A2bInput.defaultProps = {
    underlineColorAndroid: 'transparent',
    activeUnderlineColor: 'transparent',
    activeOutlineColor: 'black',
    cursorColor: 'black',
    mode: 'flat',
    value: '',
    onChangeText: () => {},
    variant: 'none',
};

export default A2bInput;
