import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './src/components/pages/Start';
import ScanTag from './src/components/pages/register/ScanTag';
import AddDescription from './src/components/pages/register/AddDescription';

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Looking for Patches">
          <Stack.Screen options={{ headerShown:true }} name="Looking for Patches" component={Start} />
          <Stack.Screen options={{ headerShown:true }} name="Scan your Patch" component={ScanTag} />
          <Stack.Screen options={{ headerShown:true }} name="Add Description" component={AddDescription} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
