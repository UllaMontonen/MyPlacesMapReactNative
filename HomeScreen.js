import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Input, ListItem } from '@rneui/themed';
import { Button } from '@rneui/themed';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

// Currently does not work correctly

export default function HomeScreen({ navigation, route }) {

    const [location, setLocation] = useState('');
    const [places, setPlaces] = useState([]);

    // Database
    const db = SQLite.openDatabase('places.db');

    // Error messages
    const error = err => console.log(err);

    // Creating the database on the first time
    const init = () => {
        console.log('init')
        db.transaction(
            tx => {
                tx.executeSql('create table if not exists places (id integer primary key not null, address text);');
            },
            error,
            getPlaces
        )
    };


    // Saving an address to the database
    const savePlace = (address) => {
        console.log('savePlace', address);
        db.transaction(
            tx => {
                tx.executeSql('insert into places (address) values (?);',
                    [address]);
            },
            error,
            getPlaces
        )
    }

    // Getting all places
    const getPlaces = () => {
        console.log('getPlaces');
        db.transaction(
            tx => {
                tx.executeSql('select * from places;', [], (_, { rows }) => {
                    console.log(rows._array);
                    setPlaces(rows._array);
                });
            }, error, null);
    }

    // Deleting an address from the database
    const deletePlace = (id) => {
        console.log('deletePlace:', id);
        db.transaction(
            tx => {
                tx.executeSql('delete from places where id = ?;', [id]);
            },
            error,
            getPlaces
        )
    }

    // Alert confirming the deletation
    const confirmDelete = id =>
        Alert.alert(
            "Do you want to remove the address?",
            "The address will be deleted permanently",
            [
                {
                    text: 'CANCEL',
                },
                {
                    text: 'YES',
                    onPress: () => deletePlace(id),
                }
            ],
            {
                cancelable: true
            }
        );

    useEffect(init, []);

    useEffect(() => {
        const { fullAddress } = route.params || false;
        if (fullAddress) {
            console.log('Save', fullAddress);
            savePlace(fullAddress);
        }
    }, [route.params?.fullAddress]);

    const renderItem = ({ item }) => (
        <ListItem
            bottomDivider
            topDivider
            onPress={() => navigation.navigation('MapScreen', { address: item.address })}
            onLongPress={() => confirmDelete(item.id)}>
            <ListItem.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ListItem.Title numberOfLines={1} style={{ flex: 1 }}>{item.address}</ListItem.Title>
                <ListItem.Subtitle right>Show on map</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <Input
                placeholder='Type in address' label='PLACEFINDER'
                onChangeText={text => setLocation(text)} value={location} />
            <Button
                title="SHOW ON MAP"
                onPress={() => {
                    if (location.trim()) {
                        navigation.navigate('MapScreen', { address: location }); // Navigate to MapScreen
                        setLocation('');
                    }
                }}
            />
            <FlatList
                data={places}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <StatusBar style='auto' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center',
    },
});
