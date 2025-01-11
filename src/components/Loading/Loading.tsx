import './Loading.css'
import loadingGif from './../../assets/loading.gif'

const Loading = () => {
    return <div className='Loading'>
        {/* <h1>Ładowanie danych</h1> */}
        <img src={loadingGif} alt='Ładowanie danych ' height={50} width={50} />
    </div>
}

export default Loading