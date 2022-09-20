import React, { useState, useEffect, useCallback } from 'react';
import { Button, Select, Slider } from 'antd';
import { ForwardOutlined, CaretRightOutlined, BackwardOutlined, PauseOutlined, FastForwardOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import Process from './Process.js' 
import logo from './logo.svg';
import './App.less';
import datajson from './data.json'

const runTime = 100;
const { Option } = Select;
const marks = {
  0: '0',
  80: '2',
  160: '4',
  240: '6',
  320: '8',
  400: '10',
  480: '12',
  560: '14',
  640:'16',
  720:'18',
  800:'20',
  880:'22',
  960: {
    style: {
      color: '#fff',
    },
    label: 24,
  },
};
const config = {
  height: 300,
  xField: 'Date',
  yField: 'scales',
  xAxis: {
    range: [0, 1],
    tickCount: 5, 
  },
  yAxis: {
    grid: {
      line: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
          lineDash: [4, 5],
          strokeOpacity: 0.2,
          shadowColor: '#fff',
          cursor: 'pointer'
        }
      }
    }
  },
  line:{
    color: '#009CCD',
    size:1
  },
  smooth: 'true',
  areaStyle: () => {
    return {
      fill: 'l(270) 0:#272E36 0.5:#009CCD 1:#009CCD',
    };
  },
};
const config2 = {
  height: 110,
  xField: 'Date',
  yField: 'scales',
  xAxis: {
    range: [0, 1],
    tickCount: 5, 
  },
  yAxis: {
    grid: {
      line: {
        style: {
          stroke: '#fff',
          lineWidth: 1,
          lineDash: [4, 5],
          strokeOpacity: 0.2,
          shadowColor: '#fff',
          cursor: 'pointer'
        }
      }
    }
  },
  line:{
    color: '#009CCD',
    size:1
  },
  smooth: 'true',
  areaStyle: () => {
    return {
      fill: 'l(270) 0:#272E36 0.5:#009CCD 1:#009CCD',
    };
  },
};
let timeInterval = null;

function App() {
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  const [forward, setForward] = useState(false);
  const [speed, setSpeed] = useState(0);
  
  const timeTickHandler = () => {
    let hour = Math.floor(time*90 / 3600);
    let minute = Math.floor(time*90 % 3600 / 60);
    if(hour < 10){
      hour = `0${hour}`
    }
    if(minute < 10){
      minute = `0${minute}`
    }
    return `${hour}:${minute}`;
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const asyncFetch = () => {
    fetch('http://localhost:3000/data.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const runProgram = () =>{  
      clearInterval(timeInterval);  
      timeInterval = setInterval(() => {
        setTime((time) => time + 1);
      }, runTime);     
  }
  const forwardProgram = () =>{
    clearInterval(timeInterval);
    if(forward === false){      
      timeInterval = setInterval(() => {
        setTime((time) => time + 2);
      }, runTime);  
      setForward(true);   
    }else{
      timeInterval = setInterval(() => {
        setTime((time) => time + 4);
      }, runTime); 
      setForward(false);
    }
         
  }
  const backwardProgram = () =>{  
    clearInterval(timeInterval);  
    timeInterval = setInterval(() => {
      setTime((time) => time - 2);
    }, runTime);     
  }
  const stopProgram = () => {
    clearInterval(timeInterval);
    return '24:00'
  }
  const resetProgram = () => {
    clearInterval(timeInterval);
    setTime(0);
  }
  const speedHandler = (e)=>{
    setSpeed(speed+1);
  }
  const newSpeed = useCallback(()=>{
    return speed
  },[speed]) 

  useEffect(() => {
    asyncFetch();
    return function cleanup() {
      clearInterval(timeInterval);
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='App-header-menu'>
          <div className='App-header-menu-select'>
            <Select defaultValue="用電場景" style={{ width: 120 }} onChange={handleChange}>
              <Option value="用電場景">用電場景</Option>
              <Option value="">用電場景</Option>
              <Option value="">用電場景</Option>
            </Select>
          </div>
          <div className='App-header-menu-select'>
            <Select defaultValue="用電負載負載" style={{ width: 120 }} onChange={handleChange}>
              <Option value="用電負載負載">用電負載負載</Option>
            </Select>
          </div>
          <div className='App-header-menu-select'>
            <Select defaultValue="儲能設備" style={{ width: 120 }} onChange={handleChange}>
              <Option value="儲能設備">儲能設備</Option>
            </Select>
          </div>
          <div className='App-header-menu-select'>
            <Select defaultValue="太陽能設備" style={{ width: 120 }} onChange={handleChange}>
              <Option value="太陽能設備">太陽能設備</Option>
            </Select>
          </div>
          <div className='App-header-menu-select'>
            <Select defaultValue="充電樁" style={{ width: 120 }} onChange={handleChange}>
              <Option value="充電樁">充電樁</Option>
            </Select>
          </div>
        </div>
        <div className='App-header-button'>
          <Button onClick={resetProgram} ghost>重置模擬</Button>
          <Button type="primary" onClick={runProgram}>執行模擬</Button>
        </div>
      </header>
      
      <main className='App-main'>
        <div className='time-zone'>
          <div className='time-text'>時間</div>
          <div className='time-clock'>{ time < 960 && time >= 0 ? timeTickHandler() : stopProgram() }</div>
          <div className='time-speed'>
              <Button icon={<BackwardOutlined />} ghost onClick={backwardProgram} shape="circle" size="large" />
              {console.log(time)}
              <Button icon={<CaretRightOutlined />} ghost onClick={runProgram} shape="circle" size="large" />
              <Button icon={<PauseOutlined />} ghost onClick={stopProgram} shape="circle" size="large" />
              <Button icon={<ForwardOutlined/>} ghost onClick={forwardProgram} shape="circle" size="large" />         
          </div>
          <div className='time-slider'>
            <Slider min={0} max={960} marks={marks} defaultValue={0} value={time} />
          </div>
        </div>
        <div className='App-row' style={{alignItems: 'stretch'}}>
          {/* main panel */}
          <div className='App-panel'>
            <div className='App-box'>
              <div className='App-box-content flex justify-center align-center'>
                <Process speed={newSpeed} />           
              </div>
            </div>          
          </div>

          {/* panel -9 */}
          <div className='App-panel'>
            <div className='App-row'>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>總用電負載</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>1,000</span><span>kWh</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>台電主網灰電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>800</span><span>kWh</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>綠能發電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>200</span><span>kWh</span>
                  </div>
                </div>
              </div>

            </div>

            <div className='App-row'>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>儲能充電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>20</span><span>kWh</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>儲能放電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>20</span><span>kWh</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>估算費用</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>1,000</span><span>NTD</span>
                  </div>
                </div>
              </div>

            </div>
             
            <div className='App-row'>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>契約容量</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>1,000</span><span>kW</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>當日最高容量</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>950</span><span>kW</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>預測最高容量</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>1,200</span><span>kW</span>
                  </div>
                </div>
              </div>

            </div>

          </div>          
        </div>
        
        {/* main-chart */}
        <div className='App-row' style={{alignItems: 'stretch'}}>
            <div className='App-panel'>
              <div className='App-box'>
                <div className='App-box-content'>
                  <h3>Load Consumption</h3>
                  <Area data={datajson} {...config} />
                </div>
              </div>          
            </div>

            {/* chart-4 */}
            <div className='App-panel'>

              <div className='App-row' style={{alignItems: 'stretch'}}>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>ESS-E0001</h3>
                      <Area data={datajson} {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>ESS-E0001</h3>
                      <Area data={datajson} {...config2} />
                    </div>
                  </div>         
              </div>

              <div className='App-row'>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>PV-P0001</h3>
                      <Area data={datajson} {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>PV-P0001</h3>
                      <Area data={datajson} {...config2} />
                    </div>
                  </div>         
              </div>             

            </div>
        </div>
      </main>

      <footer className='App-footer'>
        <p>© 2022 RFD Micro Electricity Co., Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
