import React from "react"
import { StyledInput } from "./components";

export default function Input({ type, placeholder, value, handleInput, onBlur, height, width, padding, margin, fontSize }) {
    return <StyledInput
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => { handleInput(e.target.value) }}
        width={width}
        height={height}
        padding={padding}
        margin={margin}
        fontSize={fontSize}
    />;
}