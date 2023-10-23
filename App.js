import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';

// This ReactNative app provides possibility to search for addresses, save them and delete them.

// On the HomeScreen user can search a address using the input function.
// HomeScreen also shows all the saved addresses. Those addresses are saved to the database.
// User can also delete saved addresses by holding the address line.

// On the MapScreen user will see the address they dearched. 
// User can also save saved address by pressing the save button.

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

