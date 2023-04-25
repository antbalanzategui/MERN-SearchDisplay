import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ScatterPlot from './ScatterPlot'
import './DataGrid.css'


/**
 * Antonio Balanzategui, 4/25/2023
 */


/**
 * Uses MUI DataGrid to create a DataGridComponent
 * 
 * @returns DataGridComponent
 */
const DataGridComponent = () => {

    const [rows, setRows] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // This is the exact same implementation which is seen in App.js, it is also used here for the ScatterPlot, as we cannot host the ScatterPlot directly
    // inside of App.js, as we need information regarding selected boxes from the MUI Grid
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Establishes the columns to be used to create MUI Grid
    const columns = [
        { field: 'id', headerName: 'Id', width: windowDimensions.width / 10, checkboxSelection: true },
        { field: 'Week', headerName: 'Week', width: windowDimensions.width / 10 },
        { field: 'java', headerName: 'Java', width: windowDimensions.width / 10 },
        { field: 'javascript', headerName: 'JavaScript', width: windowDimensions.width / 10},
        { field: 'python', headerName: 'Python', width: windowDimensions.width / 10},
    ];
    // Establishes the rows to be used to create MUI Grid, requires server to be up, as it performs a fetch call to our API
    useEffect(() => {
        fetch('http://localhost:8000/api/data')
            .then((response) => response.json())
            .then((data) => {
                const rows = data.map((item, index) => {
                    return { ...item, id: index + 1 };
                });
                setRows(rows);
            });
    }, []);

    // Once again similar concept to the App.js, this is necessary for responsive design
    const chartWidth = windowDimensions.width <= 768 ? windowDimensions.width * 0.9 : windowDimensions.width * 0.5;

    // Returns the DataGrid component, which contains both the DataGrid and the ScatterPlot, note the ScatterPlot's implemnetation, we 
    // must pass in rowSelectionModel and rows as props to have information regarding selected boxes
    return (
        <div>
            <div className = "gridContainer">
                <div className = "scatPlot">
            <ScatterPlot width={chartWidth} height={windowDimensions.height * 0.55} rowSelectionModel={rowSelectionModel} rows={rows}/>
                </div>
                <div className = "dataGrid">
            <DataGrid
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 25, page: 0 },
                    },
                }}
                rows={rows}
                columns={columns}
                checkboxSelection
                // This is what deals with the particular change in the dataGrid, or rather keeps track of selected rows
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                // Dark Mode Styling for the MUI DataGrid
                sx={{ color: '#b3b3b3', border: '#535353 solid', fontFamily: "Lucida Console", bgcolor: '#121212', '& .MuiDataGrid-row:hover': {
                    color: '#d9faff', 
                  },  }}

            />
                </div>
            </div>
        </div>
    );
};

export default DataGridComponent;

