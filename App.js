// App.js
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/splashScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import AdminDashboardScreenRaw from './screens/AdminDashboardScreen';
import AdminBookManagerScreenRaw from './screens/AdminBookManagerScreen';
import AdminUserListScreenRaw from './screens/AdminUserListScreen';
import UserDashboardScreenRaw from './screens/UserDashboardScreen';
import BookListScreenRaw from './screens/BookListScreen';
import SearchScreenRaw from './screens/SearchScreen';
import QuotesScreenRaw from './screens/QuotesScreen';
import TriviaScreenRaw from './screens/TriviaScreen';

import withLayout from './components/withLayout';

const AdminDashboardScreen   = withLayout(AdminDashboardScreenRaw);
const AdminBookManagerScreen = withLayout(AdminBookManagerScreenRaw);
const AdminUserListScreen    = withLayout(AdminUserListScreenRaw);
const UserDashboardScreen    = withLayout(UserDashboardScreenRaw);
const BookListScreen         = withLayout(BookListScreenRaw);
const SearchScreen           = withLayout(SearchScreenRaw);
const QuotesScreen           = withLayout(QuotesScreenRaw);
const TriviaScreen           = withLayout(TriviaScreenRaw);

import HomeTabs from './screens/HomeTabs'; // Import the tab navigator

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* No layout */}
          <Stack.Screen name="Splash"   component={SplashScreen} />
          <Stack.Screen name="Home"     component={HomeScreen} />
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* With layout */}
          <Stack.Screen name="AdminDashboard"   component={AdminDashboardScreen} />
          <Stack.Screen name="AdminBookManager" component={AdminBookManagerScreen} />
          <Stack.Screen name="AdminUserList"    component={AdminUserListScreen} />
          <Stack.Screen name="UserDashboard"    component={UserDashboardScreen} />
          <Stack.Screen name="BookList"         component={BookListScreen} />
          <Stack.Screen name="Search"           component={SearchScreen} />
          <Stack.Screen name="Quotes"           component={QuotesScreen} />
          <Stack.Screen name="Trivia"           component={TriviaScreen} />

          {/* Add Tab Navigator as a screen */}
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
