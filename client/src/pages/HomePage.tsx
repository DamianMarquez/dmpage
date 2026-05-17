import {
    Button,
    Container,
    Typography,
    Stack
} from "@mui/material";

import { Link } from "react-router-dom";

export default function HomePage() {

    return (
        <Container
            maxWidth="md"
            sx={{
                mt: 10,
                textAlign: "center"
            }}
        >
            <Stack spacing={4}>

                <Typography variant="h2">
                    Hello World 🚀
                </Typography>

                <Typography variant="h5">
                    React + Vite + TypeScript + Material UI
                </Typography>

                <Button
                    component={Link}
                    to="/about"
                    variant="contained"
                >
                    Ir a About
                </Button>

            </Stack>
        </Container>
    );
}