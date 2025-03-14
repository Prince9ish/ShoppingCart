import {Box, IconButton, TextField} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

interface QuantitySelectorProps {
    value: number
    onValueChange: (val: number) => void
    limit?: number
}

export const QuantitySelector = (props: QuantitySelectorProps) => {
    const limit = props.limit ?? Infinity

    const handleDecrement = () => {
        if (props.value > 0) {
            props.onValueChange(props.value - 1)
        }
    };

    const handleIncrement = () => {
        if (props.value < limit)
            props.onValueChange(props.value + 1)
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
            }}
        >
            <IconButton
                aria-label="decrement"
                onClick={handleDecrement}
                disabled={props.value <= 0}
            >
                <RemoveIcon/>
            </IconButton>

            <TextField
                type="number"
                variant="outlined"
                size="large"
                value={props.value}
                onChange={(e) => {
                    const targetNumber = Number(e.target.value)
                    if (targetNumber >= 0 && targetNumber <= limit) {
                        props.onValueChange(targetNumber)
                    }
                }}
                sx={{
                    width: "4rem",
                    textAlign: "center",
                    "& input[type=number]": {
                        MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                    },
                }}
                inputProps={{style: {textAlign: "center"}}}
            />
            <IconButton
                aria-label="increment"
                onClick={handleIncrement}
                disabled={props.value >= limit}
            >
                <AddIcon/>
            </IconButton>
        </Box>
    );
}
export default QuantitySelector;
