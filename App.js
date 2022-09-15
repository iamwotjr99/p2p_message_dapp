import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Ready from './Screen/Ready';
import Main from './Screen/Main';
import Chat from './Screen/Chat';
import Test from './Screen/Test';
import WaittingRoom from './Screen/WaittingRoom';

function App() {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{ 
                    headerShown: false, 
                    animationEnabled: Platform.select({
                    ios: true,
                    android: false,
                }) 
            }}>
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App


{/* <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="WattingRoom" component={WaittingRoom} /> */}