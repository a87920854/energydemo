import React, { useContext } from 'react';
import { Progress } from 'antd';
import factory from '../assets/images/factory.svg';
import charger from '../assets/images/charger.svg';
import home from '../assets/images/home.svg';
import solar from '../assets/images/solar.svg';
import store from '../assets/images/store.svg';
import { TimeContext } from '../App.js';

export function EnergySource (){
    return (<div className='node-energySource'>能源網路</div>)
  }
  
export function TaiPower (){
    const time = useContext(TimeContext);    
    return (
        <div className='node-all'>
            <img src={factory} alt={factory}/>
            <div className='text'>台電電力主網 <br/> <span className='big'>{`${Math.floor(20*(time / 100))}`}</span> kW</div>
         </div> 
      )
}
  
export function Battery (){
    const time = useContext(TimeContext);   
    return (<div className='node-all'>
                <img src={store} alt={store}/>
                <div className='text'>
                    儲能系統 <br/> 
                    <span className='big'>{`${Math.floor(20*(time / 100))}`}</span> kW <br/>
                    <Progress
                        strokeColor={{
                            '0%': '#009CCD',
                            '100%': '#00CDA8',
                        }}
                        percent={Math.floor(10*(time / 100))}
                        size="small"
                    />
                </div>
            </div>)
}

export function Solar (){
    const time = useContext(TimeContext); 
    return (<div className='node-all'>
        <img src={solar} alt={solar}/>
        <div className='text'>太陽能發電 <br/> <span className='big'>{`${Math.floor(15*(time / 100))}`}</span> kW</div>
        </div>)
}

export function Charger (){
    const time = useContext(TimeContext); 
    return (<div className='node-all'>
        <img src={charger} alt={charger}/>
        <div className='text'>充電樁 <br/> <span className='big'>{`${Math.floor(5*(time / 100))}`}</span> kW</div>
        </div>)
}

export function Home (){
    const time = useContext(TimeContext); 
    return (<div className='node-all'>
        <img src={home} alt={home}/>
        <div className='text'>一般用電負載 <br/> <span className='big'>{`${Math.floor(22*(time / 100))}`}</span> kW</div>
        </div>)
}
  