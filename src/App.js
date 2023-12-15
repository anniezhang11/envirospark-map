import './App.css';
import { GoogleMap, LoadScript, Polygon, Marker } from '@react-google-maps/api';
import response1 from './data/response1.json';
import response2 from './data/response2.json';
import response3 from './data/response3.json';
import response4 from './data/response4.json';
import response5 from './data/response5.json';
import response6 from './data/response6.json';
import postData from './data/post-request.json';

// relies on Google Maps JS API: https://developers.google.com/maps/documentation/javascript 
// relies on Travel Time API for drive radius: https://docs.traveltime.com/api/overview/introduction 

const MapContainer = () => {
    const mapStyles = {        
        height: "100vh",
        width: "100%"
    }

    // center of the United States
    const defaultCenter = {
        lat: 37.0902, lng: -95.7129
    }

    // consolidate different response data from Travel Time API
    const data = [...response1.results, 
        ...response2.results, 
        ...response3.results, 
        ...response4.results, 
        ...response5.results,
        ...response6.results];
    
    var polygonData = [];
    var cityPostData;

    // clean returned API data for usage
    data.forEach((cityData) => {
        cityPostData = postData.departure_searches.find((city) => city.id == cityData.search_id);
        console.log(cityPostData);

        cityData.shapes.map((shape) => {
            return polygonData = [
                ...polygonData, 
                {city: cityData.search_id, shape: shape.shell, center: cityPostData.coords}
            ];
        });
    })

    // hex color scale for 6 tiers
    // 600275
    // 026475
    // 2373CF
    // b87004
    // EA3323
    // 8C1911
    // existing locations: 083d01

    const colorMap ={
        'Seattle': '#600275',
        'San Francisco': '#026475',
        'DC': '#026475',
        'Los Angeles': '#026475',
        'New York': '#2373CF',
        'Miami': '#2373CF',
        'Orlando': '#b87004',
        'Phoenix': '#b87004',
        'Boston': '#b87004',
        'Denver': '#EA3323',
        'Salt Lake City': '#EA3323',
        'Columbus': '#8C1911',
        'Chicago': '#8C1911',
        'Atlanta': '#083d01',
        'Austin': '#083d01',
        'Charlotte': '#083d01',
    }

    // excluded cities are reachable by other metro hubs
    const excludeCities = [
        'Sacramento',
        'Fresno',
        'San Diego',
        'Portland',
        'Jacksonville',
        'Richmond',
        'Philadelphia',
        'Harrisburg',
        'Hartford',
        'Birmingham',
        'Greenville',
        'Tampa',
        'Memphis',
        'Cincinnati',
        'Cleveland',
        'Milwaukee',
        'Indianapolis',
        'Louisville',
        'Grand Rapids',
    ];

    return (
        // TODO: Add personal Google Maps API Key
        <LoadScript googleMapsApiKey=''>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={5}
                center={defaultCenter}
            >
                
                {/* <Polygon paths={[{lat:41.38985,lng:-73.47938},{lat:41.38985,lng:-73.481766},{lat:41.38895,lng:-73.482956},{lat:41.385345,lng:-73.482956},{lat:41.384445,lng:-73.481766},{lat:41.384445,lng:-73.477},{lat:41.382645,lng:-73.47462},{lat:41.383545,lng:-73.47343},{lat:41.38715,lng:-73.47343},{lat:41.38895,lng:-73.47105},{lat:41.38985,lng:-73.47224},{lat:41.38985,lng:-73.47938}]} /> */}

                {/* display only cities included in tiers 1-6 */}
                { polygonData.map((polygon) => {
                    if (!excludeCities.includes(polygon.city) && colorMap.hasOwnProperty(polygon.city)) {
                        return (
                            <>
                                <Polygon 
                                    paths={polygon.shape} 
                                    options={{
                                        fillColor: colorMap[polygon.city],
                                        strokeColor: colorMap[polygon.city],
                                        strokeWeight: 1,
                                        fillOpacity: 0.3,
                                    }} 
                                />

                                {/* comment out to exclude pins on the map per city center */}
                                <Marker 
                                    position={polygon.center}
                                />
                            </>
                        )
                    } 
                })}

                {/* display all cities available */}
                {/* { polygonData.map((polygon) => {
                    if (!excludeCities.includes(polygon.city) && colorMap.hasOwnProperty(polygon.city)) {
                        return (
                            <Polygon 
                                paths={polygon.shape} 
                                options={{
                                    fillColor: colorMap[polygon.city],
                                    strokeColor: colorMap[polygon.city],
                                    strokeWeight: 1,
                                    fillOpacity: 0.5,
                                }} 
                            />
                        )
                    } else if (!excludeCities.includes(polygon.city)) {
                        return (
                            <Polygon 
                                paths={polygon.shape} 
                                options={{
                                    strokeWeight: 1,
                                    fillOpacity: 0.2,
                                }} 
                            />
                        )
                    }
                })} */}
            </GoogleMap>
        </LoadScript>
    )
}

function App() {
return (
    <MapContainer />
);
}

export default App;
