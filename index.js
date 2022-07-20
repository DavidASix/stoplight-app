/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
//import App from './bleApp'//<-- simply point to the example js!

AppRegistry.registerComponent(appName, () => App);
