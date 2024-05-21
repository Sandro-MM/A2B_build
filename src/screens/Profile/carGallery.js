import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const CarGallery = ({ route }) => {
    const { data = [] } = route.params; // Destructure and provide a default value

    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenImage = (index) => {
        setCurrentIndex(index);
        setIsVisible(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {data.map((item, index) => (
                    <TouchableOpacity key={item.Id} onPress={() => handleOpenImage(index)}>
                        <Image source={{ uri: item.Name }} style={styles.image} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <ImageViewing
                images={data.map(item => ({ uri: item.Name }))}
                imageIndex={currentIndex}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    image: {
        marginHorizontal: '5%',
        marginTop:20,
        width: '90%',
        height: 260,
    },
});

export default CarGallery;
