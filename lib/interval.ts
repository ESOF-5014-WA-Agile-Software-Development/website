import { useEffect, useRef } from 'react'

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}

export default useInterval

/*
    const [count, setCount] = useState<number>(0)
    const metaMask = useAppSelector(state => state.metaMask)
    const dispatch = useAppDispatch();

    console.log("count: ", count)
    console.log("metamask: ", metaMask.exists)
    useInterval(
        () => {
            console.log('metamask: check')
            dispatch(setExists(isMetaMaskInstalled()))
            dispatch(setNetworkConnected(isNetworkConnected()))
            dispatch(setNetworkVersion(networkVersion()))
            dispatch(setSelectedAddress(getSelectedAddress()))
            setCount(count + 1)
        },
        // Delay in milliseconds or null to stop it
        !metaMask.exists ? 3000 : null,
    )
*/
