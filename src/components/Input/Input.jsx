import React from "react"
import { StyledInput } from "./components";

export default function Input({ type, placeholder, value, handleInput }) {
    return <StyledInput type={type} placeholder={placeholder} value={value} onChange={(e) => { handleInput(e.target.value) }} />;
}