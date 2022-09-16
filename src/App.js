import React, { useState, useEffect } from 'react';
import { Button, Select, Slider } from 'antd';
import { ForwardOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import Process from './Process.js' 
import logo from './logo.svg';
import './App.less';
import datajson from './data.json'

const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

function App() {
  const [data, setData] = useState([]);
  const [speed, setSpeed] = useState(0);
  const asyncFetch = () => {
    fetch('http://localhost:3000/data.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const speedHandler = (e)=>{
    setSpeed(e.value);
  }
  const marks = {
    0: '0',
    16.6: '4',
    33.3: '8',
    50: '12',
    66.6:'16',
    83.3:'20',
    100: {
      style: {
        color: '#fff',
      },
      label: 24,
    },
  };
  const config = {
    data:datajson,
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
    data:datajson,
    height: 160,
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
  useEffect(() => {
    asyncFetch();
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
          <Button type="primary">執行模擬</Button>
        </div>
      </header>
      
      <main className='App-main'>
        <div className='time-zone'>
          <div className='time-text'>時間</div>
          <div className='time-clock'>03:10</div>
          <div className='time-speed'>
              <Button icon={<ForwardOutlined />} ghost onClick={speedHandler} value="2">2X</Button>
              <Button icon={<ForwardOutlined/>} ghost onClick={speedHandler} value="4">4X</Button>          
          </div>
          <div className='time-slider'>
            <Slider marks={marks} defaultValue={37} />
          </div>
        </div>
        <div className='App-row' style={{alignItems: 'stretch'}}>
          {/* main panel */}
          <div className='App-panel'>
            <div className='App-box'>
              <div className='App-box-content padding-24'>
                <Process speed={speed} />           
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
                <div className='App-box-content padding-24'>
                  <h3>Load Consumption</h3>
                  <Area {...config} />
                </div>
              </div>          
            </div>

            {/* chart-4 */}
            <div className='App-panel'>

              <div className='App-row' style={{alignItems: 'stretch'}}>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content padding-24'>
                      <h3>ESS-E0001</h3>
                      <Area {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content padding-24'>
                      <h3>ESS-E0001</h3>
                      <Area {...config2} />
                    </div>
                  </div>         
              </div>

              <div className='App-row'>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content padding-24'>
                      <h3>PV-P0001</h3>
                      <Area {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content padding-24'>
                      <h3>PV-P0001</h3>
                      <Area {...config2} />
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
