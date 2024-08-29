import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { Colors } from './src/utils/Stylization.jsx';
import Orientation from 'react-native-orientation-locker';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from './src/utils/Dimensions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/**
 * Pages
*/
import SignUp from './src/pages/SignUp.jsx';
import Home from './src/pages/Home/Home.jsx';
import Loading from './src/pages/Loading.jsx';
import NewReleases from './src/pages/NewReleases.jsx';
import UserSettings from './src/pages/UserSettings.jsx';
import EditRelease from './src/pages/Home/EditRelease.jsx';
import MonthEndClosing from './src/pages/MonthEndClosing.jsx';
import ReleasesGrouped from './src/pages/Home/ReleasesGrouped.jsx';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import MMKV from './src/utils/MMKV/MMKV.jsx';
MMKV.init()


enableScreens();
const Stack = createStackNavigator();
const newStackScreen = (name, component, options = {}) => {
  return <Stack.Screen name={name} component={component} options={options} />
}

const Tab = createBottomTabNavigator();
const newTabScreen = (name, component, options = {}) => {
  return <Tab.Screen name={name} component={component} options={options} />
  // return <Tab.Screen name={name} component={component} options={{ headerTitleStyle: { color }, headerStyle: { backgroundColor } }} />
}


function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: ScreenWidth * 0.027,
        },
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          paddingBottom: 10,
          overflow: 'hidden',
          borderTopColor: '#ccc',
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          backgroundColor: Colors.white,
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.grey,
      })}
    >
      {newTabScreen(Home.name, Home.screen, Home.config)}
      {newTabScreen(NewReleases.name, NewReleases.screen, NewReleases.config)}
      {newTabScreen(MonthEndClosing.name, MonthEndClosing.screen, MonthEndClosing.config)}
    </Tab.Navigator>
  )
}

const App = () => {
  useEffect(() => {
    // Bloqueia a orientação no modo retrato
    Orientation.lockToPortrait();

    // Limpa o bloqueio quando o componente for desmontado
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {newStackScreen(Loading.name, Loading.screen, Loading.config)}
        {newStackScreen('Main', MyTabs, { headerShown: false })}
        {newStackScreen(SignUp.name, SignUp.screen, SignUp.config)}
        {newStackScreen(UserSettings.name, UserSettings.screen, UserSettings.config)}
        {newStackScreen(EditRelease.name, EditRelease.screen, EditRelease.config)}
        {newStackScreen(ReleasesGrouped.name, ReleasesGrouped.screen, ReleasesGrouped.config)}
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;
