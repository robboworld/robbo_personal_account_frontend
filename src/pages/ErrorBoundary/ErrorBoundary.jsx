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

    componentDidCatch(error, errorInfo) {
        this.setState({
            hasError: true,
            error,
            errorInfo,
        })
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