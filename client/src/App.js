import './App.css';
import DataGridComponent from './DataGrid';
import PieChart from './PieChart';
import Histogram from './Histogram'
import React, { useState, useEffect } from 'react';
import rowSelectionModel from './DataGrid';
import rows from './DataGrid';

/**
 * Antonio Balanzategui, 4/25/2023
 */

function App() {
    /**
     * This function is used to establish the local storage
     * it first checks to see if the localStorage has been established to prevent redundant fetch calls
     */
    async function establishLocalStorage() {
        if (!localStorage.getItem("searchData")) { // Check if searchData is not in localStorage
            try {
                const response = await fetch("http://localhost:8000/api/data"); // Fetches from our API which is created
                const jsonData = await response.json(); 
                const searchData = {
                    searchData: jsonData,
                };
                localStorage.setItem("searchData", JSON.stringify(searchData));
            } catch (error) {
                console.error(error);
            }
        }
    }
    // Establishes local Storage
    establishLocalStorage().then(() => console.log("Local Storage Established!"));

    // This is used strictly for responsive design
    const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

    // Upon resize, we will set the window dimensions, so we can then use these attributes to plot the various charts within App.js
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({width: window.innerWidth, height: window.innerHeight});
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // This is also used for responsive design, essentially upon reaching 768 resolution, the layout of the 
    // webpage will change to a vertical display to not lose quality on graphs, with this the width we use for these charts must change aswell
    const pieChartWidth = windowDimensions.width <= 768 ? windowDimensions.width * 0.8 : windowDimensions.width * 0.2;
    const barChartWidth = windowDimensions.width <= 768 ? windowDimensions.width * 0.4 : windowDimensions.width * 0.2;


    // Returns App Component
    return (
        <div className="App">
            <header className="App-header">
                Google Search Programming Trends
            </header>
            <div className="container">
                <div className="DataGridComponent">
                    <DataGridComponent rowSelectionModel={rowSelectionModel} rows={rows}/>
                </div>
                <div className="secondGrid">
                <div className="PieChart">
                    <PieChart width={pieChartWidth} height={windowDimensions.height * 0.40}/>
                </div>
                <div className="Histogram">
                    <Histogram width={barChartWidth} height={windowDimensions.height * 0.40}/>
                </div>
                </div>
            </div>
        </div>
    );
}

    export default App;

