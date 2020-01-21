import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main/Main';
import Profile from './pages/Profile/Profile';

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'Dev Radar'
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Perfil no Github'
      }
    },
  },
    {
      defaultNavigationOptions: {
        headerTintColor: '#FFF',
        headerStyle: {
          backgroundColor: '#7D40E7',
        }

      }
    }
  )
);

export default Routes;
