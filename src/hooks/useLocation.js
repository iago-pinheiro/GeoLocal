import * as Location from 'expo-location'
import { useState, useEffect } from 'react'

export default function useLocation(){
    const [coords, setCoords] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => { // Efeito colateral para obter
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permissão de localização negada')
                return
            }
            let location = await Location.getCurrentPositionAsync({}) // obtém a localização
            setCoords({
                latitude: location.coords.latitude, // define as coordenadas da latitude
                longitude: location.coords.longitude, // define as coordenadas da longitude
            }) // Atualiza o estado com as coordenadas obtidas
        })() // Executa a função assíncrona

    }, []) // Array de dependências vazio para executar apenas uma vez
    return {coords, errorMsg} // Retorna as coordenadas e a mensagem de erro
}