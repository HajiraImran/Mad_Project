import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import HeaderGradient from '../components/HeaderGradient';


import UserDashboardScreen from './UserDashboardScreen';
import AdminDashboardScreen from './AdminDashboardScreen';
import BookListScreen from './BookListScreen';
import SearchScreen from './SearchScreen';
import QuotesScreen from './QuotesScreen';
import TriviaScreen from './TriviaScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ route }) {
  const { role, userId } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'tachometer-alt';
              break;
            case 'Books':
              iconName = 'book';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Quotes':
              iconName = 'quote-left';
              break;
            case 'Trivia':
              iconName = 'question-circle';
              break;
            default:
              iconName = 'circle';
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#DDA0DD',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerBackground: () => <HeaderGradient />,  // <-- use gradient here
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={role === 'admin' ? AdminDashboardScreen : UserDashboardScreen}
        initialParams={{ userId, role }}
      />
      <Tab.Screen
        name="Books"
        component={BookListScreen}
        initialParams={{ userId, role }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{ userId, role }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        initialParams={{ userId, role }}
      />
      <Tab.Screen
        name="Trivia"
        component={TriviaScreen}
        initialParams={{ userId, role }}
      />
    </Tab.Navigator>
  );
}
