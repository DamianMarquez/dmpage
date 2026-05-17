import {
    Button,
    Container,
    Typography,
    Stack
} from "@mui/material";

import { Link } from "react-router-dom";

export default function AboutPage() {

    return (
        <Container
            maxWidth="md"
            sx={{
                mt: 10,
                textAlign: "center"
            }}
        >
            <Stack spacing={4}>

                <Typography variant="h3">
                    About Page
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                >
                    Volver
                </Button>

            </Stack>
        </Container>
    );
}