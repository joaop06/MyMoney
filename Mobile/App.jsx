import * as React from 'react';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/**
 * Pages
*/
import SignUp from './src/pages/SignUp.jsx';
import Loading from './src/pages/Loading.jsx';
import UserSettings from './src/pages/UserSettings.jsx';
import Categories from './src/pages/Categories.jsx';
import NewReleases from './src/pages/NewReleases.jsx';
import HomeScreen from './src/pages/Home/HomeScreen.jsx';
import EditRelease from './src/pages/Home/EditRelease.jsx';
import MonthEndClosing from './src/pages/MonthEndClosing.jsx';
import ReleasesGrouped from './src/pages/Home/ReleasesGrouped.jsx';


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
    <Tab.Navigator>
      {newTabScreen(HomeScreen.name, HomeScreen.screen, HomeScreen.config)}
      {newTabScreen(NewReleases.name, NewReleases.screen, NewReleases.config)}
      {newTabScreen(Categories.name, Categories.screen, Categories.config)}
      {newTabScreen(MonthEndClosing.name, MonthEndClosing.screen, MonthEndClosing.config)}
    </Tab.Navigator>
  )
}

function App() {
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
