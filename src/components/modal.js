import React from 'react';
import { View } from 'react-native';
import {Modal, Portal } from 'react-native-paper';
import {ConfirmRedBtn, SmallConfirmText} from "../styles/styles";

const DeleteConfirmationModal = ({ isVisible, onCancel, children, confirmButton, cancelButton }) => {
    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onCancel} contentContainerStyle={{ backgroundColor: 'white', width:'85%', margin:'7.5%', borderRadius: 15, padding:5}}>
                {children}
                <View style={{flexDirection:'row', marginTop:20, justifyContent:'center'}}>
                    {confirmButton && <ConfirmRedBtn
                        buttonColor='#FF5A5F'
                        mode="contained"
                        {...confirmButton}
                    >
                        <SmallConfirmText>{confirmButton.title}</SmallConfirmText>
                    </ConfirmRedBtn>}
                    {cancelButton && <ConfirmRedBtn
                        buttonColor='#555353'
                        mode="contained"
                        {...cancelButton}
                    >
                        <SmallConfirmText>{cancelButton.title}</SmallConfirmText>
                    </ConfirmRedBtn>}
                </View>

            </Modal>
        </Portal>
    );
};

export default DeleteConfirmationModal;


