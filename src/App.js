import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

// Main component
export default function Converter() {
  const [ppm, setPpm] = useState('');
  const [ueg, setUeg] = useState('');
  const [gas, setGas] = useState('');
  const [conversionFactor, setConversionFactor] = useState(null);

  const conversionFactors = {
    'R1234ze': 0.0015385,
    'R32': 0.0007519,
    'R134a': 0.0013333,
    'R22': 0.0020408,
    'Methane': 0.002,
    'Propane': 0.0047619,
    'Hydrogen': 0.0025,
    'Acetylene': 0.004,
    'Ethylene': 0.0037037,
    'Propylene': 0.005,
    'Butane': 0.0055556,
    'Pentane': 0.0066667,
  };

  const handlePpmChange = (e) => {
    const ppmInput = e.target.value;
    setPpm(ppmInput);
    if (ppmInput !== '' && gas !== '') {
      const factor = conversionFactors[gas];
      setConversionFactor(factor);
      let uegValue = parseFloat(ppmInput) * factor;
      if (uegValue > 100) {
        uegValue = 100;
      }
      setUeg(uegValue.toFixed(2));
    } else {
      setUeg('');
    }
  };

  const handleUegChange = (e) => {
    let uegInput = parseFloat(e.target.value);
    if (isNaN(uegInput)) {
      setUeg('');
      setPpm('');
      return;
    }

    if (uegInput > 100) {
      uegInput = 100;
    }
    setUeg(uegInput.toString());

    if (uegInput !== '' && gas !== '') {
      const factor = conversionFactors[gas];
      setConversionFactor(factor);
      const ppmValue = uegInput / factor;
      setPpm(ppmValue.toFixed(0));
    } else {
      setPpm('');
    }
  };

  const handleGasChange = (e) => {
    const gasValue = e.target.value;
    setGas(gasValue);
    const factor = conversionFactors[gasValue];
    setConversionFactor(factor);

    if (ppm !== '') {
      let uegValue = parseFloat(ppm) * factor;
      if (uegValue > 100) {
        uegValue = 100;
      }
      setUeg(uegValue.toFixed(2));
    } else if (ueg !== '') {
      let uegInput = parseFloat(ueg);
      if (uegInput > 100) {
        uegInput = 100;
        setUeg(uegInput.toString());
      }
      const ppmValue = uegInput / factor;
      setPpm(ppmValue.toFixed(0));
    }
  };

  const handleClear = () => {
    setPpm('');
    setUeg('');
    setGas('');
    setConversionFactor(null);
  };

  // Data for the graph
  const graphData = {
    labels: Array.from({ length: 101 }, (_, i) => i), // 0 to 100% LEL
    datasets: [
      {
        label: 'PPM vs %LEL',
        data: conversionFactor
          ? Array.from({ length: 101 }, (_, i) => (i / conversionFactor).toFixed(2))
          : [],
        fill: false,
        borderColor: 'blue',
      },
    ],
  };

  const graphOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: '% LEL',
        },
        ticks: {
          stepSize: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'PPM',
        },
      },
    },
  };

  // Value for 50% LEL
  const ppmAt50LEL = conversionFactor ? (50 / conversionFactor).toFixed(0) : null;

  return (
    <div className="container">
      <h1>Gas Conversion App</h1>
      <div>
        <label htmlFor="ppm">PPM</label>
        <input id="ppm" type="number" value={ppm} onChange={handlePpmChange} />
      </div>

      <div>
        <label htmlFor="ueg">UEG (% LEL)</label>
        <input id="ueg" type="number" value={ueg} onChange={handleUegChange} />
      </div>

      <div>
        <label htmlFor="gas">Gas</label>
        <select id="gas" value={gas} onChange={handleGasChange}>
          <option value="">Select Gas</option>
          {Object.keys(conversionFactors).map((gasName) => (
            <option key={gasName} value={gasName}>
              {gasName}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleClear}>Clear</button>

      {ppm && ueg && gas && (
        <div>
          <h2>Conversion Details</h2>
          <p>Gas: {gas}</p>
          <p>Conversion Factor: {conversionFactor}</p>
          <p>{ppm} ppm × {conversionFactor} = {ueg}% UEG</p>
        </div>
      )}

      {conversionFactor && (
        <div>
          <Line data={graphData} options={graphOptions} />
          <p>PPM at 50% LEL: {ppmAt50LEL}</p>
        </div>
      )}
    </div>
  );
}
