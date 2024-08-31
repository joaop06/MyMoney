import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, Button } from 'react-native';

const config = { headerShown: false };

const UserSettings = () => {
    const navigation = useNavigation();

    const handleEditProfile = () => {
        // Lógica para editar o perfil do usuário
    };

    const handleLogout = () => {
        // Lógica para logout do usuário
        navigation.reset({
            index: 0,
            routes: [{ name: 'Loading' }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Informações do Usuário</Text>
            {/* Adicione os campos de informações do usuário aqui */}
            <Button title="Editar Perfil" onPress={handleEditProfile} />
            <Button title="Sair" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
    },
});

export default { name: 'UserSettings', screen: UserSettings, config };