import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useTimerToggle from 'hooks/useTimerToggle'

jest.useFakeTimers()

describe('testing useTimerToggle', () => {
    beforeEach(() => {
        jest.clearAllTimers()
    })

    it('should return boolean and a fn to update the bool', () => {
        const mockUseEffect = jest.fn((callback) => callback),
            spy2 = jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

        expect(mockUseEffect).toHaveBeenCalledTimes(0)

        const { result } = renderHook(() => useTimerToggle(2))

        expect(result.current[0]).toBe(false)

        expect(mockUseEffect).toHaveBeenCalledTimes(1)

        act(() => {
            result.current[1]()
        })

        expect(mockUseEffect).toHaveBeenCalledTimes(2)

        expect(result.current[0]).toBe(true)

        act(() => {
            const useEffectFn = mockUseEffect.mock.results[1].value
            useEffectFn()
            jest.runAllTimers()
        })

        expect(result.current[0]).toBe(false)
    })

    it('should not do anything if toggle state is false', () => {
        const mockUseEffect = jest.fn((callback) => callback),
            spy2 = jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

        expect(mockUseEffect).toHaveBeenCalledTimes(0)

        const { result } = renderHook(() => useTimerToggle(2))

        expect(mockUseEffect).toHaveBeenCalledTimes(1)
        expect(result.current[0]).toBe(false)

        act(() => {
            const useEffectFn = mockUseEffect.mock.results[0].value
            useEffectFn()
            jest.runAllTimers()
        })

        expect(mockUseEffect).toHaveBeenCalledTimes(1)

        expect(result.current[0]).toBe(false)
    })

    it('should clear timer if unmount', () => {
        const mockUseEffect = jest.fn((callback) => callback),
            spy2 = jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

        expect(mockUseEffect).toHaveBeenCalledTimes(0)

        const { result } = renderHook(() => useTimerToggle(2))

        expect(mockUseEffect).toHaveBeenCalledTimes(1)

        act(() => {
            result.current[1]()
        })

        expect(mockUseEffect).toHaveBeenCalledTimes(2)

        expect(result.current[0]).toBe(true)

        act(() => {
            const useEffectFn = mockUseEffect.mock.results[1].value,
                clear = useEffectFn()

            clear()

            jest.runAllTimers()
        })

        // unchanged since we cleared timeout before it was ran
        expect(result.current[0]).toBe(true)
    })
})
