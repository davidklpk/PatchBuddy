import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './src/components/pages/Start';
import ScanTag from './src/components/pages/register/ScanTag';
import AddDescription from './src/components/pages/register/AddDescription';
import Setup from './src/components/pages/Setup';

// export type RootStackParamList = {
//   Setup: undefined;
//   Start: {tts: boolean};
//   Rewrite : undefined;
//   Describe : undefined;
// };

function App(): JSX.Element {

  // const Stack = createNativeStackNavigator<RootStackParamList>();
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Setup">
          <Stack.Screen options={{ headerShown:false }} name="Setup" component={Setup} />
          <Stack.Screen options={{ headerShown:false }} name="Start" component={Start} />
          <Stack.Screen options={{ headerShown:false }} name="Rewrite" component={ScanTag} />
          <Stack.Screen options={{ headerShown:false }} name="Describe" component={AddDescription} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 

