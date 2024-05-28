import React from 'react';
import SubnetCalculator from '../components/SubnetCalculator';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>IPv4 Subnet Calculator</h1>
      <SubnetCalculator />
    </div>
  );
};

export default App;
