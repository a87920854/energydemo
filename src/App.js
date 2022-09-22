import React, { useState, useEffect, createContext } from 'react';
import { Button, Select, Slider, notification, Spin } from 'antd';
import Icon, { ForwardOutlined, CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import Process from './component/Process';
import LoadingData from './component/LoadingData';
import logo from './assets/images/logo.svg';
import './assets/css/App.less';

// context
export const TimeContext = createContext(0);

// loading spin
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 40,
    }}
    spin
  />
);

// 模擬結束時跳出訊息
const openNotification = (placement) => {
  notification.info({
    message: `模擬結束`,
    description:
      '本次模擬已結束。',
    placement,
  });
};

//快轉icon
const FastForwardSvg = ()=> (
  <svg fill="currentColor" width="1em" height="1em" viewBox="0 0 12 12">
    <path d="M7.8,5.9L4.4,2.9c-0.1-0.1-0.3,0-0.3,0.2v5.8c0,0.2,0.2,0.3,0.3,0.2l3.4-2.9C7.9,6.1,7.9,5.9,7.8,5.9z M4.1,5.9L0.7,2.9
      c-0.1-0.1-0.3,0-0.3,0.2v5.8c0,0.2,0.2,0.3,0.3,0.2l3.4-2.9c0,0,0.1-0.1,0.1-0.2C4.1,6,4.1,5.9,4.1,5.9z"/>
    <path d="M11.6,5.9L8.2,2.9c-0.1-0.1-0.3,0-0.3,0.2v5.8c0,0.2,0.2,0.3,0.3,0.2l3.4-2.9C11.6,6.1,11.6,5.9,11.6,5.9z"/>
  </svg>
)
const FastForwardIcon = (props) => <Icon component={FastForwardSvg} {...props} />;

//動畫更新速率
const runTime = 100;

//ant option
const { Option } = Select;

//滾動條 時間點位
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

// 圖表設定
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
  meta: {
    Date: {
      min: 0,
      max: 100,
    },
  },
  animation: {
    // 配置图表第一次加载时的入场动画
    appear: {
      animation: 'scale-in-x', // 动画效果
      duration: 500,  // 动画执行时间
    },
  }
};

// 圖表設定
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

// 計時器
let timeInterval = null;

// App
function App() {
  //狀態
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(false);
  const [forward, setForward] = useState(0);
  
  //主面板設定
  const procesConfig = {
    speed: forward,
    time
  }

  //數字轉時間(時、分)
  const timeTickHandler = () => {
    let hour = Math.floor(time*90 / 3600);
    let minute = Math.floor(time*90 % 3600 / 60);
    if(hour < 10){
      hour = `0${hour}`
    }
    if(minute < 10){
      minute = `0${minute}`
    }
    if(time < 960 && time >= 0){     
      return `${hour}:${minute}`; 
    }else{
      if(forward > 0 && time > 0){
        openNotification('top');
        stopProgram(); 
      }   
      return `24:00`;    
    }    
  }

  //滾動條 change 事件
  const onChangeSlider = (newValue) => {
    setTime(newValue);
    setForward(3);
  }

  //滾動條 afterChange 事件
  const onAfterChangeSlider = () => {
    setForward(0);
  }

  //下拉選單 change 事件
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  //讀取API
  const asyncFetch = () => {
    fetch('http://192.168.101.85:3000/data.json')
      .then((response) => response.json())
      .then((json) => {
        let data = JSON.stringify(json);
        data = JSON.parse(data);
        setData(data);
        setTimeout(()=>{
          runProgram();
        },2000)        
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  //繪製圖表
  const drawCharts = () => {
    const newData = data.filter((item,index)=>{
      return index < Math.floor(time/10);
    })
    return newData;
  }
  //執行模擬
  const startProgram = () =>{
    setStart(true);
  }

  // play按鈕
  const runProgram = () =>{
    if(time>=0 && time<960){
      clearInterval(timeInterval);  
      timeInterval = setInterval(() => {
        setTime((time) => time + 1);
      }, runTime);
      setForward(1);
    }      
  }

  // 加速按鈕
  const forwardProgram = () =>{
    if(time>=0 && time<960){
      if(time % 2 !== 0) setTime( time => time +1);
      clearInterval(timeInterval);
      if(forward === 2){
        timeInterval = setInterval(() => {
          setTime((time) => time + 4);
        }, runTime); 
        setForward(3);
      }else{
        timeInterval = setInterval(() => {
          setTime((time) => time + 2);
        }, runTime);  
        setForward(2);
      }
    }
  }

  //停止按鈕
  const stopProgram = () => {
    clearInterval(timeInterval);
    if(forward !== 0) setForward(0);
  }

  //重製按鈕
  const resetProgram = () => {
    clearInterval(timeInterval);
    setTime(0);
    setForward(0);
  }

   // userEffect
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
              <Option value="用電負載負載">用電負載</Option>
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
          <Button type="primary" onClick={startProgram}>執行模擬</Button>
        </div>
      </header>
      {console.log(data)}
      {start ? '':<LoadingData />}
      {data.length !== 0 ? 
        <main className='App-main'>
        <div className='time-zone'>
          <div className='time-text'>時間</div>
          <div className='time-clock'>{ timeTickHandler() }</div>
          <div className='time-speed'>         
              <Button icon={<CaretRightOutlined />} ghost onClick={runProgram} shape="circle" size="large" />
              <Button icon={<PauseOutlined />} ghost onClick={stopProgram} shape="circle" size="large" />
              <Button icon={forward === 0 ? <ForwardOutlined/> : forward === 1 ? <ForwardOutlined/> : forward === 2 ? <ForwardOutlined/> : <FastForwardIcon/>} ghost onClick={forwardProgram} shape="circle" size="large" />         
          </div>
          <div className='time-slider'>
            <Slider min={0} max={960} marks={marks} defaultValue={0} value={time} onChange={onChangeSlider} onAfterChange={onAfterChangeSlider}/>
          </div>
        </div>
        <div className='App-row' style={{alignItems: 'stretch'}}>
          {/* main panel */}
          <div className='App-panel'>
            <div className='App-box'>
              <div className='App-box-content flex justify-center align-center'>
                <TimeContext.Provider value={time}>
                  <Process {...procesConfig} />  
                </TimeContext.Provider>                         
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
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kWh</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>台電主網灰電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kWh</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>綠能發電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kWh</span>
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
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kWh</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>儲能放電</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kWh</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>估算費用</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*3)}</span><span>NTD</span>
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
                    <span className='number'>{Math.floor(time*Math.random())}</span><span>kW</span>
                  </div>
                </div>
              </div> 

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>當日最高容量</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*4)}</span><span>kW</span>
                  </div>
                </div>
              </div>

              <div className='App-box App-box-small'>
                <div className='App-box-header'>
                    <h3>預測最高容量</h3>
                </div>
                <div className='App-box-content text-center'>
                  <div className='number-wrap'>
                    <span className='number'>{Math.floor(time*5)}</span><span>kW</span>
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
                  <Area data={drawCharts()} {...config} />
                </div>
              </div>          
            </div>

            {/* chart-4 */}
            <div className='App-panel'>

              <div className='App-row' style={{alignItems: 'stretch'}}>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>ESS-E0001</h3>
                      <Area data={drawCharts()} {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>ESS-E0001</h3>
                      <Area data={drawCharts()} {...config2} />
                    </div>
                  </div>         
              </div>

              <div className='App-row'>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>PV-P0001</h3>
                      <Area data={drawCharts()} {...config2} />
                    </div>
                  </div>
                  <div className='App-box App-box-medium'>
                    <div className='App-box-content'>
                      <h3>PV-P0001</h3>
                      <Area data={drawCharts()} {...config2} />
                    </div>
                  </div>         
              </div>             

            </div>
        </div>
      </main> : <div className='App-spin'><Spin indicator={antIcon} /></div>}     

      <footer className='App-footer'>
        <p>© 2022 RFD Micro Electricity Co., Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
