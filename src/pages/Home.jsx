/* eslint-disable no-unused-vars */
import { useState , useEffect } from "react"
import MovieCard from "../components/MovieCard"
import  {searchMovies , getPopularMovies} from '../services/api'
import "../css/Home.css"

function Home(){
    const [searchQuery,setSearchQuery] = useState("")
    const [movies , setMovies]   =  useState([])
    const [error , setError] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        const loadPopularMovies =  async () => {
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch(err) { 
                setError("Failed To Load Movies ...")
             }
            finally{ 
                setLoading(false)
             }
        }
        loadPopularMovies()
    },[])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if (loading) return 
        setLoading(true)
        try{
            const searchResult = await searchMovies(searchQuery)
            setMovies(searchResult)
            setError(null)
        }catch(err){
            setError("Failed To Search Movies ...")
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for a movie  ..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="Submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {
                loading ?  <div className="loading">Loading ... </div> : 
                <div className="movies-grid">
                    { movies.map(
                        (movie) => 
                            movie.title.toLowerCase().startsWith(searchQuery) && (
                                <MovieCard movie={movie} key={movie.id}/>
                            )
                        )}
                </div>
            }
        </div>
    )
}

export default Home