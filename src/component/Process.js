import React, { useState, useEffect, useRef } from 'react'
import {EnergySource,TaiPower,Battery,Solar,Charger,Home} from './Nodes'
import { Graph } from '@antv/x6'
import { Portal } from '@antv/x6-react-shape'
import insertCss from 'insert-css'

const X6ReactPortalProvider = Portal.getProvider()

//容器寬度
const containerWidth = 866;

// component Process
export default function Process ({speed,time}) {
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
        shape: 'react-shape',
        component: <EnergySource />,
      })

      // 台電電力主網
      const icon_factory = graph.addNode({
        x: 50 * (width/containerWidth),
        y: 10,
        width: 151,
        height: 161,
        shape: 'react-shape',
        component: <TaiPower />
      })
      
      // 儲能系統
      const icon_store = graph.addNode({
        x: 700 * (width/containerWidth),
        y: 185,
        width: 74,
        height: 118,
        shape: 'react-shape',
        component: <Battery />,
      })

      // 太陽能發電
      const icon_solar = graph.addNode({
        x: 690 * (width/containerWidth),
        y: 10,
        width: 99,
        height: 133,
        shape: 'react-shape',
        component: <Solar />,
      })

      // 充電樁
      const icon_charger = graph.addNode({
        x: 410 * (width/containerWidth),
        y: 185,
        width: 60,
        height: 133,
        shape: 'react-shape',
        component: <Charger />,
      })

      // 負載
      const icon_home = graph.addNode({
        x: 50 * (width/containerWidth),
        y: 190,
        width: 133,
        height: 128,
        shape: 'react-shape',
        component: <Home />,
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
            // sourceMarker:'classic',
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
        <X6ReactPortalProvider />
        <div className="process-content" ref={container}><TaiPower /></div>
      </>
    )
  }