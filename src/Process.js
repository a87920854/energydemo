import React, { useState, useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'
import insertCss from 'insert-css'
import factory from './factory.svg';
import charger from './charger.svg';
import home from './home.svg';
import solar from './solar.svg';
import store from './store.svg';

//容器寬度
const containerWidth = 866;

//能源網路
function node_energySource(){
  const wrap = document.createElement('div')
  wrap.style.width = '120px'
  wrap.style.height = '120px'
  wrap.style.borderRadius = '50%'
  wrap.style.backgroundImage = 'radial-gradient(50% 50% at 50% 50%, #6ACAE9 6.25%, #009CCD 71.88%)'
  wrap.style.display = 'flex'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.style.color = '#fff'
  wrap.style.fontSize = '18px'
  wrap.style.fontWeight = 'bold'
  wrap.innerText = '能源網路'
  return wrap;
}

//台電電力主網
function node_taipower(num){
  const wrap = document.createElement('div')
  const image = document.createElement('img')
  const text = document.createElement("div")          
  text.innerText = `台電電力主網 \n ${num}kW`  
  text.style.color = '#fff'
  text.style.textAlign = 'center'
  text.style.lineHeight = '1.1'
  image.src = factory
  image.style.width = '100%'
  image.style.marginBottom = '5px'
  wrap.style.width = '100%'
  wrap.style.height = '100%'
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.appendChild(image)
  wrap.appendChild(text)
  return wrap
}

//儲能系統
function node_store(num,power){
  const wrap = document.createElement('div')
  const image = document.createElement('img')
  const text = document.createElement("div")          
  text.innerText = `儲能系統 \n ${num}kWh \n ${power}功率` 
  text.style.color = '#fff'
  text.style.textAlign = 'center'
  text.style.lineHeight = '1.2'
  image.src = store
  image.style.width = '100%'
  image.style.marginBottom = '5px'
  wrap.style.width = '100%'
  wrap.style.height = '100%'
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.appendChild(image)
  wrap.appendChild(text)
  return wrap
}

//solar
function node_solar(num){
  const wrap = document.createElement('div')
  const image = document.createElement('img')
  const text = document.createElement("div")          
  text.innerText = `太陽能發電 \n ${num}kW` 
  text.style.color = '#fff'
  text.style.textAlign = 'center'
  text.style.lineHeight = '1.2'
  image.src = solar
  image.style.width = '100%'
  image.style.marginBottom = '5px'
  wrap.style.width = '100%'
  wrap.style.height = '100%'
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.appendChild(image)
  wrap.appendChild(text)
  return wrap
}

//充電樁
function node_charger(num){
  const wrap = document.createElement('div')
  const image = document.createElement('img')
  const text = document.createElement("div")          
  text.innerText = `充電樁 \n ${num}kW` 
  text.style.color = '#fff'
  text.style.textAlign = 'center'
  text.style.lineHeight = '1.2'
  image.src = charger
  image.style.width = '100%'
  image.style.marginBottom = '5px'
  wrap.style.width = '100%'
  wrap.style.height = '100%'
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.appendChild(image)
  wrap.appendChild(text)
  return wrap
}

//負載
function node_home(num){
  const wrap = document.createElement('div')
  const image = document.createElement('img')
  const text = document.createElement("div")          
  text.innerText = `一般用電負載 \n ${num}kW` 
  text.style.color = '#fff'
  text.style.textAlign = 'center'
  text.style.lineHeight = '1.2'
  image.src = home
  image.style.width = '100%'
  image.style.marginBottom = '5px'
  wrap.style.width = '100%'
  wrap.style.height = '100%'
  wrap.style.display = 'flex'
  wrap.style.flexDirection = 'column'
  wrap.style.justifyContent = 'center'
  wrap.style.alignItems = 'center'
  wrap.appendChild(image)
  wrap.appendChild(text)
  return wrap
}

// component Process
export default function Process ({speed}) {
    //狀態
    const container = useRef(null)
    const [width,setWidth] = useState(0);

    const resizeUpdate = (e) =>{
      let w = container.current.offsetWidth;
      setWidth(w);
    }

    //useEffect
    useEffect(()=> {
      resizeUpdate();
      window.addEventListener('resize',resizeUpdate);   
      
      const graph = new Graph({
        container: container.current,
        grid: {
          size: 10,      // 网格大小 10px
          visible: true, // 绘制网格，默认绘制 dot 类型网格
          type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
          args: { 
            color: '#435161', // 网格线/点颜色
            thickness: 1,     // 网格线宽度/网格点大小
          },
        }
      })

      // 能源網路      
      const target = graph.addNode({
        x: 380 * (width/containerWidth),
        y: 15,
        width: 120,
        height: 120,
        shape: 'html',
        html: node_energySource(),
      })

      // 台電電力主網
      const icon_factory = graph.addNode({
        x: 50 * (width/containerWidth),
        y: 0,
        width: 151,
        height: 161,
        shape: 'html',
        html: node_taipower(100)
      })
      
      // 儲能系統
      const icon_store = graph.addNode({
        x: 700 * (width/containerWidth),
        y: 185,
        width: 74,
        height: 118,
        shape: 'html',
        html: node_store(120,100),
      })

      // 太陽能發電
      const icon_solar = graph.addNode({
        x: 690 * (width/containerWidth),
        y: 10,
        width: 99,
        height: 133,
        shape: 'html',
        html: node_solar(20),
      })

      // 充電樁
      const icon_charger = graph.addNode({
        x: 410 * (width/containerWidth),
        y: 190,
        width: 50,
        height: 133,
        shape: 'html',
        html: node_charger(120),
      })

      // 負載
      const icon_home = graph.addNode({
        x: 50 * (width/containerWidth),
        y: 190,
        width: 133,
        height: 128,
        shape: 'html',
        html: node_home(120),
      })

      //連線 (台電>能源網路)
      graph.addEdge({
        source: icon_factory,
        target: target,
        connector: { name: 'smooth' },
        attrs: {
          line: {
            stroke: '#00CDA8',
            strokeDasharray: 4,
            targetMarker: 'classic',
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        },
      })

      //連線 (太陽能>能源網路)
      graph.addEdge({
        source: icon_solar,
        target: target,
        // label:'太陽能',
        connector: { name: 'smooth' },        
        attrs: {
          line: {
            sourceMarker:'classic',
            stroke: '#00CDA8',
            strokeDasharray: 4,
            targetMarker: 'classic',
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        },
      })

      //連線 (儲能系統>能源網路)
      graph.addEdge({
        source: icon_store,
        target: target,
        connector: { name: 'smooth' },
        attrs: {
          line: {
            stroke: '#00CDA8',
            strokeDasharray: 4,
            targetMarker: 'classic',
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        },
      })

      //連線 (能源網路>充電樁)
      graph.addEdge({
        source: target,
        target: icon_charger,
        connector: { name: 'smooth' },
        attrs: {
          line: {
            stroke: '#009CCD',
            strokeDasharray: 4,
            targetMarker: 'classic',
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        },
      })

      //連線 (能源網路>負載)
      graph.addEdge({
        source: target,
        target: icon_home,
        connector: { name: 'smooth' },
        attrs: {
          line: {
            stroke: '#009CCD',
            strokeDasharray: 4,
            targetMarker: 'classic',
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        },
      })

      //動畫速度
      insertCss(`
        @keyframes ant-line {
          to {
              stroke-dashoffset: ${ speed === 0 ? -500 : speed === 1 ? -1000 : speed === 2 ? -2000 : -3000}
          }
        }
      `)

      return () =>{
        window.removeEventListener('resize',resizeUpdate)
      }
    },[width,speed])
  
    
  
    return (
      <>
        <div className="process-content" ref={container}></div>
      </>
    )
  }