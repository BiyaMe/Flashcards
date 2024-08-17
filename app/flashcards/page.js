'use client'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
//import { db } from "@/firebase";

let db;
if (typeof window !== 'undefined') {
    const { db: fs } = require('@/firebase');
    db = fs;
}

import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { CardActionArea, Grid, Card, Container, CardContent, Typography } from "@mui/material";

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, {flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcards/${id}`)
    }

    return <Container maxWidth="100vw">
        <Grid container spacing = {3} sx={{mt: 4}}>
            {flashcards.map((flashcard, index) => {
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => handleCardClick(id)}>
                            <CardContent>
                                <Typography variant="h6">{flashcard.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            }
            )}
        </Grid>
    </Container>

}