/**
*/
* React Native Mobile Application
* Author: Member 4
import React, { useState, useEffect, useRef } from 'react';
import {
View, Text, StyleSheet, ScrollView, RefreshControl,
Alert, Platform, AppState, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import PushNotification from 'react-native-push-notification';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
const { width: screenWidth } = Dimensions.get('window');
const SystemMonitorApp = () =&gt; {
const [systemData, setSystemData] = useState(null);
const [isOffline, setIsOffline] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [appState, setAppState] = useState(AppState.currentState);
const intervalRef = useRef(null);
const API
BASE
URL =
DEV
_
_
__
__
? 'http://localhost:5000/api/v1'
: 'https://your-production-url.com/api/v1';
useEffect(() =&gt; {
initializeApp();
setupAppStateListener();
setupNetworkListener();
setupPushNotifications();
return () =&gt; {
if (intervalRef.current) {
clearInterval(intervalRef.current);
}
};
}, []);
const initializeApp = async () =&gt; {
try {
// Load cached data first
const cachedData = await loadCachedData();
if (cachedData) {
setSystemData(cachedData);
}
// Start real-time updates
startDataPolling();
} catch (error) {
console.error('App initialization failed:'
, error);
}
};
const setupNetworkListener = () =&gt; {
NetInfo.addEventListener(state =&gt; {
setIsOffline(!state.isConnected);
if (state.isConnected &amp;&amp; !intervalRef.current) {
startDataPolling();
}
});
};
const setupAppStateListener = () =&gt; {
const handleAppStateChange = (nextAppState) =&gt; {
if (appState.match(/inactive|background/) &amp;&amp; nextAppState ===
// App has come to foreground
startDataPolling();
} else if (nextAppState.match(/inactive|background/)) {
// App has gone to background
if (intervalRef.current) {
clearInterval(intervalRef.current);
intervalRef.current = null;
}
}
setAppState(nextAppState);
};
AppState.addEventListener('change'
, handleAppStateChange);
};
const setupPushNotifications = () =&gt; {
PushNotification.configure({
onNotification: function(notification) {
console.log('Push notification received:'
if (notification.userInteraction) {
// User tapped notification
fetchSystemData();
}
, notification);
},
requestPermissions: Platform.OS ===
'ios'
});
};
const startDataPolling = () =&gt; {
if (intervalRef.current) {
clearInterval(intervalRef.current);
}
// Initial fetch
fetchSystemData();
// Poll every 5 seconds
intervalRef.current = setInterval(() =&gt; {
fetchSystemData();
}, 5000);
};
const fetchSystemData = async () =&gt; {
try {
const response = await fetch(`${API
BASE
_
_
URL}/system/stats
timeout: 10000,
headers: {
'Accept': 'application/json'
,
'Content-Type': 'application/json'
`
}
});
if (response.ok) {
const data = await response.json();
setSystemData(data);
await cacheData(data);
} else {
throw new Error(`HTTP ${response.status}`);
, {
}
} catch (error) {
console.error('Failed to fetch system data:'
if (isOffline) {
const cachedData = await loadCachedData();
if (cachedData) {
setSystemData({
...cachedData,
offline
_
mode: true,
last
_
update: cachedData.timestamp
, error);
});
}
}
}
};
const cacheData = async (data) =&gt; {
try {
await AsyncStorage.setItem('systemData'
...data,
cached
_
at: new Date().toISOString()
}));
} catch (error) {
console.error('Failed to cache data:'
, JSON.stringify({
, error);
}
};
const loadCachedData = async () =&gt; {
try {
const cached = await AsyncStorage.getItem('systemData');
return cached ? JSON.parse(cached) : null;
} catch (error) {
console.error('Failed to load cached data:'
, error);
return null;
}
};
const onRefresh = async () =&gt; {
setRefreshing(true);
await fetchSystemData();
setRefreshing(false);
};
const renderSystemMetrics = () =&gt; {
if (!systemData) {
return (
&lt;View style={styles.loadingContainer}&gt;
&lt;Text style={styles.loadingText}&gt;Loading system data..
&lt;/View&gt;
);
}
const { cpu, memory, disk, network } = systemData;
return (
&lt;View style={styles.metricsContainer}&gt;
{/* Status Header */}
&lt;View style={styles.statusHeader}&gt;
&lt;Text style={styles.statusTitle}&gt;System Status&lt;/Text
&lt;View style={[
styles.statusIndicator,
{ backgroundColor: isOffline ? '#ff6b6b' : '#51cf66' }
]}&gt;
&lt;Text style={styles.statusText}&gt;
{isOffline ? 'Offline' : 'Online'}
&lt;/Text&gt;
&lt;/View&gt;
&lt;/View&gt;
{/* Progress Circles */}
&lt;View style={styles.progressContainer}&gt;
&lt;ProgressChart
data={{
labels: ['CPU'
,
'Memory'
,
'Disk'],
data: [
(cpu?.usage
_percent || 0) / 100,
(memory?.usage
_percent || 0) / 100,
(disk?.usage
_percent || 0) / 100
]
}}
width={screenWidth - 40}
height={220}
strokeWidth={16}
radius={32}
chartConfig={{
backgroundColor: '#ffffff'
,
backgroundGradientFrom: '#ffffff'
,
backgroundGradientTo: '#ffffff'
,
decimalPlaces: 1,
color: (opacity = 1) =&gt;
`
rgba(34, 128, 176, ${opac
labelColor: (opacity = 1) =&gt;
`
rgba(0, 0, 0, ${opac
}}
/&gt;
&lt;/View&gt;
hideLegend={false}
{/* Detailed Metrics */}
&lt;View style={styles.detailsContainer}&gt;
&lt;MetricCard
title=
"CPU Usage"
value={`${cpu?.usage
_percent || 0}%`}
trend={cpu?.trend || 'stable'}
color=
"#3498db"
/&gt;
&lt;MetricCard
title=
"Memory Usage"
value={`${memory?.usage
_percent || 0}%`}
trend={memory?.trend || 'stable'}
color=
"#9b59b6"
/&gt;
&lt;MetricCard
title=
"Disk Usage"
value={`${disk?.usage
_percent || 0}%`}
trend={disk?.trend || 'stable'}
color=
"#e74c3c"
/&gt;
&lt;MetricCard
title=
"Network I/O"
value={`${Math.round((network?.total
_
rate || 0) / 1024)}
trend={network?.trend || 'stable'}
color=
"#2ecc71"
/&gt;
&lt;/View&gt;
&lt;/View&gt;
);
};
return (
&lt;ScrollView
style={styles.container}
refreshControl={
&lt;RefreshControl refreshing={refreshing} onRefresh={onRefresh}
}
&gt;
{renderSystemMetrics()}
&lt;/ScrollView&gt;
);
};
// Metric Card Component
const MetricCard = ({ title, value, trend, color }) =&gt; (
&lt;View style={[styles.metricCard, { borderLeftColor: color }]}&gt;
&lt;Text style={styles.metricTitle}&gt;{title}&lt;/Text&gt;
&lt;Text style={styles.metricValue}&gt;{value}&lt;/Text&gt;
&lt;View style={styles.trendContainer}&gt;
&lt;Text style={[
styles.trendText,
{ color: trend ===
trend ===
'increasing' ? '#e74c3c' :
'decreasing' ? '#2ecc71' : '#95a5a6' }
]}&gt;
{trend ===
trend ===
&lt;/Text&gt;
&lt;/View&gt;
&lt;/View&gt;
'increasing' ? '↗' :
'decreasing' ? '↘' : '
→
'} {trend}
);
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f8f9fa'
},
loadingContainer: {
flex: 1,
justifyContent: 'center'
alignItems: 'center'
,
padding: 20
,
},
loadingText: {
fontSize: 16,
color: '#6c757d'
},
metricsContainer: {
padding: 20
},
statusHeader: {
flexDirection: 'row'
justifyContent: 'space-between'
alignItems: 'center'
,
,
marginBottom: 20
},
statusTitle: {
fontSize: 24,
fontWeight: 'bold'
color: '#2c3e50'
,
,
},
statusIndicator: {
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 20
},
statusText: {
color: 'white'
,
fontSize: 12,
fontWeight: '600'
},
progressContainer: {
alignItems: 'center'
marginBottom: 30
,
},
detailsContainer: {
gap: 15
},
metricCard: {
backgroundColor: 'white'
,
padding: 20,
borderRadius: 12,
borderLeftWidth: 4,
shadowColor: '#000'
,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3
},
metricTitle: {
fontSize: 14,
color: '#6c757d'
marginBottom: 5
,
},
metricValue: {
fontSize: 28,
fontWeight: 'bold'
color: '#2c3e50'
,
marginBottom: 8
,
},
trendContainer: {
alignItems: 'flex-end'
},
trendText: {
fontSize: 12,
fontWeight: '600'
,
textTransform: 'capitalize'
}
});
export default SystemMonitorApp;
