import React, { Component } from "react"

import ErrorFallback from "./ErrorFallback.jsx"

export default class ErrorBoundary extends Component {
    constructor() {
        super()
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })
        console.error('Unhandled UI error', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback />
            )
        }

        return this.props.children
    }
}