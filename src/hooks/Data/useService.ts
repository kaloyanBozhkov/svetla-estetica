import { useMemo, useState } from 'react'

const useService = <ServiceProps>(
    service: (serrviceProps: ServiceProps) => Promise<unknown>
): {
    fireService: (serviceProps: ServiceProps) => void
    completed: boolean
    isPending: boolean
    error: null | string
} => {
    const [completed, setCompleted] = useState(false),
        [isPending, setPending] = useState(false),
        [error, setError] = useState<null | string>(null),
        fireService = useMemo(
            () => (serviceProps: ServiceProps) => {
                setPending(true)
                service(serviceProps)
                    .then(() => setCompleted(true))
                    .catch(setError)
                    .finally(() => setPending(false))
            },
            [service]
        )

    return { fireService, completed, isPending, error }
}

export default useService
