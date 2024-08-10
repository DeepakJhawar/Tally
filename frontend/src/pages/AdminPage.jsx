// // src/pages/AdminPage.js
// import React from 'react';
// import DataTable from '../components/Table/DataTable';

// const sampleData = [
//   { problemHeading: 'Problem 1' },
//   { problemHeading: 'Problem 2' },
//   { problemHeading: 'Problem 3' }
// ];

// const AdminPage = () => (
//   <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//     <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Problems Table</h1>
//     <DataTable rows={sampleData} />
//   </div>
// );

// export default AdminPage;
// src/pages/AdminPage.js
import React from 'react';
import DataTable from '../components/Table/DataTable';

const sampleData = [
  { problemHeading: 'Problem 1', details: 'Details for Problem 1' },
  { problemHeading: 'Problem 2', details: 'Details for Problem 2' },
  { problemHeading: 'Problem 3', details: 'Details for Problem 3' }
];

const AdminPage = () => (
  <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Problems Table</h1>
    <DataTable rows={sampleData} />
  </div>
);

export default AdminPage;
