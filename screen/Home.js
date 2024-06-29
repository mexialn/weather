import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Image, ScrollView } from 'react-native';
import { parseString } from 'react-native-xml2js';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('London');
  const [search, setSearch] = useState('London');

  const fetchWeather = (location) => {
    setLoading(true);
    fetch(`http://api.weatherapi.com/v1/current.xml?key=9015745e3e774dcf96a214401242406&q=${location}`)
      .then(response => response.text())
      .then(text => {
        console.log('Response text:', text);
        parseString(text, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('XML parse error:', err);
            setError(err);
          } else {
            console.log('Parsed data:', result);
            setWeatherData(result.root);
            setError(null);
          }
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(query);
  }, [query]);

  const handleSearch = () => {
    setQuery(search);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={search}
        onChangeText={setSearch}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error fetching data</Text>
      ) : weatherData ? (
        <>
          <Text style={styles.title}>Weather in {weatherData.location.name}</Text>
          <Text style={styles.info}>Temperature: {weatherData.current.temp_c}°C</Text>
          <Text style={styles.info}>Condition: {weatherData.current.condition.text}</Text>
          <Text style={styles.info}>Wind Speed: {weatherData.current.wind_kph} kph</Text>
        </>
      ) : null}
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

