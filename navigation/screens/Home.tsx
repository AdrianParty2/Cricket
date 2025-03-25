import { Text } from 'react-native';
import { StyleSheet, View } from 'react-native';

export function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});