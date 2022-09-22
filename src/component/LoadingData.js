import loaddata from '../assets/images/loaddata.jpg';

export default function LoadingData (){
    return (<div className='load-data'>
        <div className='load-data-txt'>
            <h1>Please Enter Data</h1>
            <p>請輸入資料</p>
        </div>
        <img className='load-data-img' src={loaddata} alt={loaddata} />
    </div>)
}