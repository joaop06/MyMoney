import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

module.exports = () => {
    const [theme, setTheme] = useState(useColorScheme())

    // useEffect(() => {

    // }, [theme])
} 