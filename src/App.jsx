import { useCallback, useEffect, useState } from "react";
import { Greeting } from "./components/Greeting";
import { Button } from "./components/Button";
import { InputGroup } from "./components/InputGroup";

function App() {
  const [pokemon, setPokemon] = useState([])
  const [pokeInput, setPokeInput] = useState("")
  const [pokeSearch, setPokeSearch] = useState("")
  const [pokeDetails, setPokeDetails] = useState()
  const [showPokeDetails, setShowPokeDetails] = useState(false)



  useEffect(() => {
    const loadPokemon = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`
  
      const resp = await fetch(url)
      const { results } = await resp.json()
  
      setPokemon([...results])
    }
    loadPokemon()
  }, [])

  useEffect(() => {
    if (pokeSearch.length > 0) {
        searchPokemon()
        return
    }

    if (pokeInput.length === 0) {
      setShowPokeDetails(false)
      return
    }
  }, [pokeSearch, pokeInput])

  const searchPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeSearch}`

    const resp = await fetch(url)
    const results = await resp.json()
    console.log(results)
    setPokeDetails({...results})
    setShowPokeDetails(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPokeSearch(pokeInput)
  }

  return (
    <div>
      <h1>Pokedex</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="pokesearch">Search Pokemon</label>{' '}
          <input 
            type="text" 
            name="pokesearch" 
            value={pokeInput} 
            onChange={(e) => setPokeInput(e.target.value)} 
          />
          <input type="submit" value="Search" />
        </form>
      </div>
      {!showPokeDetails && pokemon.length > 0 && (
        <ul>
          {pokemon.map(({name}) => {
            return (
              <li key={name}>
                <h2>{name}</h2>
                <button onClick={ (e) => {
                  setPokeSearch(name)
                  searchPokemon(e)
                }}>Get details</button>
              </li>
            )
          })}
        </ul>
      )}
      {showPokeDetails && pokeDetails && (
        <div>
          <div style={{display: 'flex', justifyContent:'space-between'}}>
            <h2>{pokeDetails?.name}</h2>
            <button  onClick={()=>{
                // addToPokedex(pokeDetails?.name)
              }}>Add To Pokedex</button>
          </div>
          <img width={300} src={pokeDetails?.sprites?.other["official-artwork"].front_default} alt="" />
          <ul>
            {pokeDetails?.stats.map(({base_stat, stat: {name}}) => {
              return(<li key={name}>{name}: {base_stat}</li>)
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
