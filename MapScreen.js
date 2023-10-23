import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from '@rneui/themed';
import { useEffect, useState } from 'react';


export default function MapScreen({ route, navigation }) {

    const { address } = route.params;

    const initial = {
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    }

    const [region, setRegion] = useState(initial);
    const [fullAddress, setFullAddress] = useState('');

    useEffect(() => { fetchCoordinates(address); }, []);

    const fetchCoordinates = (address) => {
        const KEY = process.env.EXPO_PUBLIC_API_TOKEN;
        const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const location = data.results[0].location[0];
                console.log(location);
                const { lat, lng } = location.latLng;
                setRegion({ ...region, latitude: lat, longitude: lng });
                setFullAddress(`${location.street} ${location.adminArea6} ${location.adminArea5}`)
            })
            .catch(error =>
                console.log('API call failed. Did you provide a valid API key?', error.message));
        
    };
// Keyboard.dismiss();

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            >
                <Marker coordinate={region} title={fullAddress} />
            </MapView>
            <View style={styles.button}>
            <Button
                title="SAVE LOCATION"
                onPress={() => navigation.navigate('HomeScreen', { saveItem })} // Saving the address on MapScreen
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    button: {
        marginBottom: 25,
    }
});
