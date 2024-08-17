'use client'

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, CircularProgress } from "@mui/material";

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return

            try {
                const res = await fetch('/api/checkout-session?session_id=${session_id}')
                const sessionData = await res.json()
                if (res.ok){
                    setSession(sessionData)
                } else {
                    setError(sessionData)
                }
            } catch (err){
                setError('An error occured')
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading){
        return (
            <Container
            maxWidth="md"
            sx={{
                textAlign:'center',
                mt: 4
            }}>
                <CircularProgress/>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        )
    }

    if (error){
        return (
            <Container
            maxWidth="md"
            sx={{
                textAlign:'center',
                mt: 4
            }}>
                <CircularProgress/>
                <Typography variant="h6">{error}</Typography>
            </Container>
        )
    }
    return(
        <Container
            maxWidth="md"
            sx={{
                textAlign:'center',
                mt: 4
            }}>
                {session.payment_status === 'paid' ? (
                    <>
                        <Typography variant="h4">Thank you for purchasing</Typography>
                        <Box sx={{mt: 22}}>
                            <Typography variant="h6">Session ID: {session_id}</Typography>
                            <Typography variant="body1">You will receive an email with the details of your purchase</Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4">Payment Failed</Typography>
                        <Box sx={{mt: 22}}>
                            <Typography variant="body1">Your payment is unsuccesful. Please try again.</Typography>
                        </Box>
                    </>
                )}
            </Container>
    )
}
