import { useEffect, useState } from 'react'

const useTimerToggle = ({ untoggleAfter }: { untoggleAfter: number }): [boolean, () => void] => {
    const [toggleError, setToggleError] = useState(false)

    useEffect(() => {
        if (toggleError) {
            const id = setTimeout(() => setToggleError(false), untoggleAfter * 1000)

            // on unmount clear timer
            return () => clearTimeout(id)
        }
    }, [toggleError, untoggleAfter])

    return [toggleError, () => setToggleError(true)]
}

export default useTimerToggle
