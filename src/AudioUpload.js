import React, { useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, CircularProgress, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const AudioUpload = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [probabilities, setProbabilities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("Please upload an audio file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8000/predict/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setPrediction(response.data.prediction);
            setProbabilities(response.data.probabilities);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file or getting the prediction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh", padding: "2rem", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card style={{ maxWidth: 600, width: "100%", backgroundColor: "#1e1e1e", color: "#FFFFFF" }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Apilage Projects
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                        <TextField
                            type="file"
                            inputProps={{ accept: ".wav" }}
                            onChange={handleFileChange}
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: "1rem", backgroundColor: "#333", color: "#FFFFFF" }}
                            InputLabelProps={{ style: { color: "#FFFFFF" } }}
                            // inputProps={{ style: { color: "#FFFFFF" } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<UploadFileIcon />}
                            disabled={loading}
                            fullWidth
                            style={{ marginBottom: "1rem" }}
                        >
                            {loading ? "Predicting..." : "Predict"}
                        </Button>
                    </form>

                    {loading && (
                        <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                            <CircularProgress style={{ color: "#FFFFFF" }} />
                        </div>
                    )}

                    {prediction !== null && (
                        <Card style={{ backgroundColor: "#1e1e1e", color: "#FFFFFF", marginTop: "2rem", padding: "1rem" }}>
                            <CardContent>
                                <Typography variant="h5" align="center" gutterBottom>
                                    Prediction Result
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ color: "#FFFFFF", borderBottom: "1px solid #333" }}>
                                                    <strong>Predicted Class</strong>
                                                </TableCell>
                                                <TableCell style={{ color: "#FFFFFF", borderBottom: "1px solid #333" }}>
                                                    {prediction}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2} style={{ color: "#FFFFFF", textAlign: "center", borderBottom: "1px solid #333" }}>
                                                    <strong>Class Probabilities</strong>
                                                </TableCell>
                                            </TableRow>
                                            {probabilities.map((prob, index) => (
                                                <TableRow key={index}>
                                                    <TableCell style={{ color: "#FFFFFF", borderBottom: "1px solid #333" }}>
                                                        Class {index}
                                                    </TableCell>
                                                    <TableCell style={{ color: "#FFFFFF", borderBottom: "1px solid #333" }}>
                                                        {prob.toFixed(4)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AudioUpload;