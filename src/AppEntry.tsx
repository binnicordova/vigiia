import {initBackgroundFetch} from "./hooks/useBackgroundFetch";
import {initNotification} from "./hooks/useNotification";
import {initFetchUpdate} from "./hooks/useUpdates";
import {initLocationService} from "./services/location";
import {InitUserThunk} from "./stores/user";

InitUserThunk();
initBackgroundFetch();
initNotification();
initLocationService();
initFetchUpdate();

import "expo-router/entry";
