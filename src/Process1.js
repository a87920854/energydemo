import React, { useState, useEffect, useRef } from 'react'
import G6 from '@antv/g6';
import insertCss from 'insert-css'
import factory from './factory.svg';
import charger from './charger.svg';
import home from './home.svg';
import solar from './solar.svg';
import store from './store.svg';

const indexWidth = 1920;
const img = new Image();
img.src = solar

export default function Process ({speed}) {   
    const container = useRef(null);
    const [width,setWidth] = useState(0);
    const resizeUpdate = (e) =>{
      let w = window.innerWidth;
      setWidth(w);
    }
    
    useEffect(()=> {
      console.log(speed)
      // resizeUpdate()
      const data = {
        nodes: [
          {
            x: width,
            y: 100,
            type: 'circleNode',
            label: 'circle',
            id: 'node1',
            labelCfg: {
              position: 'center',
            },
          },
          {
            x: 350,
            y: 100,
            type: 'image',
            id: 'node2',
            img: img.src,
            size: [120, 60],
            label: `speed${speed}`,
            style: {
              cursor: 'pointer',
            },
            labelCfg: {
              position: 'bottom',
            },
          },
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2',
            label: 'line',
            labelCfg: {
              refY: 10,
            },
          },
        ],
      };
      const graph = new G6.Graph({
        container: container.current,
        width:400,
        height:400,
        defaultNode: {
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
          },
        },
        defaultEdge: {
          color: '#e2e2e2',
        },
        modes: {
          default: [
            'drag-node',
            {
              type: 'drag-node',
            },
          ],
        },
      });
      graph.data(data);
      graph.render();
    
      return () =>{
        window.removeEventListener('resize',resizeUpdate)
      }
    },[])
  
    
  
  return (
    <>
      <div className="process-content" ref={container} />      
    </>
  )
}